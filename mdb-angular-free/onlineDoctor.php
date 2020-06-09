<?php

    use \Psr\Http\Message\ServerRequestInterface as Request;
    use \Psr\Http\Message\ResponseInterface as Response;
    use Firebase\JWT as auth;
    use Firebase\Bearer as token;

$app->post('/filemaker/api/register', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();

    try{        
        global $fm;
        $layout_name = 'User_LIST';

        $fname =$request->getParam('fname');
        $lname =$request->getParam('lname');
        $email =$request->getParam('email');
        $phone =$request->getParam('phone');
        $pass =$request->getParam('password');
        $cnf_pass=$request->getParam("cnf_pass");
        $spec =$request->getParam('specialization');
        $exp =$request->getParam('experience');
        $qual =$request->getParam('qualification');
        $adhar =$request->getParam('adhar');
        $status= "Requested";

        $name = $fname." ".$lname;

        $salt = "usernameDOBlocation";
        $pass_secure = hash('gost', $pass.$salt);

        if($exp == ""){
            $userType = "Patient";
            $values = array("Name" => "$name", 'Email' => "$email", "AdharNumber" => "$adhar", 'Phone' => "$phone", 'UserType' => "$userType", 'Password' => "$pass_secure", "Status" => "$status");
        }else{
            $userType = "Doctor";
            $avail = "False";
            $values = array("Name" => "$name",  "Availablity" => "$avail", 'Email' => "$email", "AdharNumber" => "$adhar", 'Phone' => "$phone", 'UserType' => "$userType", 'Password' => "$pass_secure", "Specialization" => "$spec", "Experience" => "$exp", "Qualification" => "$qual", "Status" => "$status");
        }
        
        $rec = $fm->createRecord($layout_name, $values);
        if(FileMaker::isError($rec)){
            die('Error - ' . $rec->getCode() . ' ' . $rec->getMessage());
        }
        $result = $rec->commit();
        if (FileMaker::isError($result)) {
            $data_unfound = array('message' => 'something is wrong',  'status'=> '400');
            return $newResponse = $response->withJson($data_unfound,400);
        }
        if( $result == true){
            $data_unfound = array('message' => 'record added',  'status'=> '201');
            return $newResponse = $response->withJson($data_unfound, 201);
        }
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound, 401);
    }
});

// doctor login api
$app->post('/filemaker/api/doctor/login', function(Request $request, Response $response, array $args)
{

    $email =$request->getParam('email');
    $pass =$request->getParam('password');
    $userType = "Doctor";
    $secret = "secretkey";
    $body = $response->getBody();
    
    global $fm;
    $flag=false;
    $flag1=false;

    $salt = "usernameDOBlocation";
    $pass_secure = hash('gost', $pass.$salt);

    try{
        $layout_name = 'User_LIST';

        $findcommand = $fm->newFindCommand($layout_name);
        $findcommand->addFindCriterion('Email',"==".$email);
        $findcommand->addFindCriterion('Password',"==".$pass_secure);
        $findcommand->addFindCriterion('UserType',"==".$userType);
        $findcommand->setLogicalOperator(FILEMAKER_FIND_AND);
        $result = $findcommand->execute();


        if (FileMaker::isError($result)) {
            $data_unfound = array('message' => 'Invalid Email or Password');
            return $newResponse = $response->withJson($data_unfound,400);
        }       
 
        if($result){
            $payload = array(
                'iat' => time(),
                'iss' => 'slimproject',
                'exp' => time() + (60*180),
                'userName' => $email
            );
            $jwt = new auth\jwt();
            $token = $jwt->encode($payload, $secret);
            $records = $result->getRecords();
            foreach($records as $record){
                if($record->getField('Status') == "Accepted" && $record->getField('Availablity') == "True"){
                    
                    $layout = 'doctor_AVAILABLE';
                    $find = $fm->newFindCommand($layout);
                    $find->addFindCriterion('__kf_DoctorId',"==".$record->getField('__Kp_UserId'));
                    $find->setLogicalOperator(FILEMAKER_FIND_AND);
                    $res = $find->execute();
    
                    if (FileMaker::isError($res)) {
                        $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                        // return $newResponse = $response->withJson($data_unfound,400);
                    }       
             
                    if($res){
                        $recs = $res->getRecords();
                        foreach($recs as $rec){
                            $data2 = array("ID" => $rec->getField('__kf_DoctorId'), "Shift" => $rec->getField('Shift'), "Day" => $rec->getField('Day'), "Mode" => $rec->getField('ConsultMode'), "TimeSlot"=> $rec->getField('TimeSlot'), "Day"=> $rec->getField('Day'),"PatientTime"=> $rec->getField('PatientTime'));
                            $flag=true;
                        }
                    }

                    $layout = 'APOINTMENT';
                    $findcommand = $fm->newFindCommand($layout);
                    $findcommand->addFindCriterion('__kf_DoctorId',"==".$record->getField('__Kp_UserId'));
                    $findcommand->setLogicalOperator(FILEMAKER_FIND_AND);
                    $reslt = $findcommand->execute();
    
                    if (FileMaker::isError($reslt)) {
                        $data_unfound = array('message' => 'Record Not Found');
                        // return $newResponse = $response->withJson($data_unfound,400);
                    }
                    $Appointment = [];
                    if($reslt){
                        $recs = $reslt->getRecords();
                        foreach($recs as $re){
                            $data = array("AppointmentId" => $re->getField('___kp_AppointNum'), "Date" => $re->getField('Date'), "DoctorId" => $re->getField('__kf_DoctorId'), "DoctorName" => $record->getField('Name'), "PatientId" => $re->getField('__kf_PatientId'), "PatientName" => $re->getField('PatientName'), "PatientEmail" => $re->getField('PatientEmail'), "PatientPhone" => $re->getField('PatientPhone'), "TimeSlot"=> $re->getField('TimeSlot'), "Status"=> $re->getField('Status'),"Feedback"=> $re->getField('Feedback'));
                            array_push($Appointment,$data);
                            $flag1=true;
                        }
                    }
                }
                if($flag1==true){
                    $data1 = array("Availablity" => $record->getField('Availablity'), "Status" => $record->getField('Status'), "UserType" => $record->getField('UserType'), "ID" => $record->getField('__Kp_UserId'), "Name"=> $record->getField('Name'), "Email"=> $record->getField('Email'), "Gender"=> $record->getField('Gender'), "DOB"=> $record->getField('DOB'), "Adhar"=> $record->getField('AdharNumber'), "Phone"=> $record->getField('Phone'), "Country"=> $record->getField('Country'), "State"=> $record->getField('State'), "City"=> $record->getField('City'), "Specialization"=> $record->getField('Specialization'), "BloodGroup"=>$record->getField('BGroup'), "Experience"=> $record->getField('Experience'), "Qualification"=> $record->getField('Qualification'), 'Token' => "$token", "Appointments" => $Appointment);
                }else{
                    $data1 = array("Availablity" => $record->getField('Availablity'), "Status" => $record->getField('Status'), "UserType" => $record->getField('UserType'), "ID" => $record->getField('__Kp_UserId'), "Name"=> $record->getField('Name'), "Email"=> $record->getField('Email'), "Gender"=> $record->getField('Gender'), "DOB"=> $record->getField('DOB'), "Adhar"=> $record->getField('AdharNumber'), "Phone"=> $record->getField('Phone'), "Country"=> $record->getField('Country'), "State"=> $record->getField('State'), "City"=> $record->getField('City'), "Specialization"=> $record->getField('Specialization'), "BloodGroup"=>$record->getField('BGroup'), "Experience"=> $record->getField('Experience'), "Qualification"=> $record->getField('Qualification'), 'Token' => "$token");
                }
                
            }
            if($flag==true)
                return $newResponse = $response->withJson(array_merge($data2, $data1),200);
            else
                return $newResponse = $response->withJson($data1,200);
        }
    }catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}}';
    }
});

// patient login api
$app->post('/filemaker/api/patient/login', function(Request $request, Response $response, array $args)
{
    $email =$request->getParam('email');
    $pass =$request->getParam('password');
    $userType = "Patient";
    $secret = "secretkey";
    $body = $response->getBody();

    global $fm;
    $salt = "usernameDOBlocation";
    $pass_secure = hash('gost', $pass.$salt);

    try{
        $layout_name = 'User_LIST'; 
        $findcommand = $fm->newFindCommand($layout_name);
        $findcommand->addFindCriterion('Email',"==".$email);
        $findcommand->addFindCriterion('Password',"==".$pass_secure);
        $findcommand->addFindCriterion('UserType',"==".$userType);
        $findcommand->setLogicalOperator(FILEMAKER_FIND_AND);
        $result = $findcommand->execute();

        if (FileMaker::isError($result)) {
            $data_unfound = array('message' => 'Invalid Email or Password');
            return $newResponse = $response->withJson($data_unfound,400);
        }        
 
        if($result){
            $payload = array(
                'iat' => time(),
                'iss' => 'slimproject',
                'exp' => time() + (60*180),
                'userName' => $email
            );
            $jwt = new auth\jwt();
            $token = $jwt->encode($payload, $secret);
            $records = $result->getRecords();
            foreach($records as $record){
                $layout = 'APOINTMENT'; 
                // $Date = date('d/m/Y');
                $findcommand = $fm->newFindCommand($layout);
                $findcommand->addFindCriterion('__kf_PatientId',"==".$record->getField('__Kp_UserId'));
                // $findcommand->addFindCriterion('Status',"=="."Booked");
                // $findcommand->addFindCriterion('Date',"==".$Date);
                $findcommand->setLogicalOperator(FILEMAKER_FIND_AND);
                $reslt = $findcommand->execute();

                if (FileMaker::isError($reslt)) {
                    $data_unfound = array('message' => 'Record Not Found');
                    // return $newResponse = $response->withJson($data_unfound,400);
                }
                $Appointment = [];
                if($reslt){
                    $recs = $reslt->getRecords();
                    foreach($recs as $re){
                        $find = $fm->newFindCommand($layout_name);
                        $find->addFindCriterion('__Kp_UserId',"==".$re->getField('__kf_DoctorId'));
                        $find->setLogicalOperator(FILEMAKER_FIND_AND);
                        $res1 = $find->execute();

                        if (FileMaker::isError($res1)) {
                            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                            //return $newResponse = $response->withJson($data_unfound,400);
                        }

                        if($res1){
                            $recs = $res1->getRecords();
                            foreach($recs as $rec){
                                $doctorName = $rec->getField('Name');
                            }
                        }
                        $data1 = array("AppointmentId" => $re->getField('___kp_AppointNum'), "Date" => $re->getField('Date'), "DoctorId" => $re->getField('__kf_DoctorId'), "DoctorName" => "$doctorName", "PatientId" => $re->getField('__kf_PatientId'), "PatientName" => $re->getField('PatientName'), "PatientEmail" => $re->getField('PatientEmail'), "PatientPhone" => $re->getField('PatientPhone'), "TimeSlot"=> $re->getField('TimeSlot'), "Status"=> $re->getField('Status'),"Feedback"=> $re->getField('Feedback'));
                        array_push($Appointment,$data1);
                        $flag=true;
                    }
                }
                $data = array("Status" => $record->getField('Status'), "UserType" => $record->getField('UserType'), "ID" => $record->getField('__Kp_UserId'), "Name"=> $record->getField('Name'), "Email"=> $record->getField('Email'), "Gender"=> $record->getField('Gender'), "DOB"=> $record->getField('DOB'), "Adhar"=> $record->getField('AdharNumber'), "Phone"=> $record->getField('Phone'), "Country"=> $record->getField('Country'), "State"=> $record->getField('State'), "City"=> $record->getField('City'), "BloodGroup"=>$record->getField('BGroup'), 'Token' => "$token");
                if($flag==true){
                    $data2 = array("Status" => $record->getField('Status'), "UserType" => $record->getField('UserType'), "ID" => $record->getField('__Kp_UserId'), "Name"=> $record->getField('Name'), "Email"=> $record->getField('Email'), "Gender"=> $record->getField('Gender'), "DOB"=> $record->getField('DOB'), "Adhar"=> $record->getField('AdharNumber'), "Phone"=> $record->getField('Phone'), "Country"=> $record->getField('Country'), "State"=> $record->getField('State'), "City"=> $record->getField('City'), "BloodGroup"=>$record->getField('BGroup'), 'Token' => "$token", "Appointments" => $Appointment);
                    return $newResponse = $response->withJson($data2,200);
                }else{
                    return $newResponse = $response->withJson($data,200);
                }
            }
        }
    }catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}}';
    }
});

$app->put('/filemaker/api/doctor/update', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $secret = "secretkey";
    $type = "Doctor";

    try{
        global $fm;
        $token = new token\bearer();
        $tok = $token->getBearerToken();
        $jwt = new auth\jwt();
        $payload = $jwt->decode($tok, $secret, ['HS256']);

        $layout_name = 'User_LIST';
        $find = $fm->newFindCommand($layout_name);
        $find->addFindCriterion('Email',"==".$payload->userName);
        $find->addFindCriterion('UserType',"==".$type);
        $find->setLogicalOperator(FILEMAKER_FIND_AND);
        $res = $find->execute();
        if (FileMaker::isError($res)) {
            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
            //return $newResponse = $response->withJson($data_unfound,400);
        }
        if($res){
            $record = $res->getRecords()[0]->_impl;
            $recId = $record->getRecordId(); 
            if($record){
                $name =$request->getParam('name');
                $ID = $request->getParam('id1');
                $phone =$request->getParam('phone');
                $email =$request->getParam('email');
                $gender =$request->getParam('gender');
                $dob = $request->getParam('dob');
                $adhar = $request->getParam('adhar');
                $blood = $request->getParam('bgroup');
                $country = $request->getParam('country');
                $state = $request->getParam('state');
                $city = $request->getParam('city');
                $specialization = $request->getParam('specialization');
                $experience = $request->getParam('experience');
                $qualification = $request->getParam('qualification');

                $values = array("Name" => "$name", 'Phone' => "$phone", 'Qualification' => "$qualification", 'Experience' => "$experience", 'Specialization' => "$specialization", 'Email' => "$email", 'BGroup' => "$blood", 'Gender' => "$gender", 'AdharNumber' => "$adhar", 'DOB' => "$dob", 'Country' => "$country", 'State' => "$state", 'City' => "$city");
                $newedit = $fm->newEditCommand($layout_name, $recId, $values);
                $result = $newedit->execute();
                if (FileMaker::isError($result)) {
                    $data_unfound = array('message' => 'record did  not match',  'status'=> '400');
                    return $newResponse = $response->withJson($data_unfound,400);
                }
                if( $result == true){
                    $data = array("ID" => "$ID", "Name" => "$name", 'Phone' => "$phone", 'Qualification' => "$qualification", 'Experience' => "$experience", 'Specialization' => "$specialization", 'Email' => "$email", 'BloodGroup' => "$blood", 'Gender' => "$gender", 'Adhar' => "$adhar", 'DOB' => "$dob", 'Country' => "$country", 'State' => "$state", 'City' => "$city");
                    return $newResponse = $response->withJson($data, 200);
                }
            }        
        }
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound,401);
    }
});

$app->put('/filemaker/api/patient/update', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $secret = "secretkey";
    $type = "Patient";

    try{
        global $fm;
        $token = new token\bearer();
        $tok = $token->getBearerToken();
        $jwt = new auth\jwt();
        $payload = $jwt->decode($tok, $secret, ['HS256']);

        $layout_name = 'User_LIST';
        $find = $fm->newFindCommand($layout_name);
        $find->addFindCriterion('Email',"==".$payload->userName);
        $find->addFindCriterion('UserType',"==".$type);
        $find->setLogicalOperator(FILEMAKER_FIND_AND);
        $res = $find->execute();
        if (FileMaker::isError($res)) {
            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
            //return $newResponse = $response->withJson($data_unfound,400);
        }
        if($res){
            $record = $res->getRecords()[0]->_impl;
            $recId = $record->getRecordId(); 
            if($record){
                $name =$request->getParam('name');
                $ID = $request->getParam('id');
                $phone =$request->getParam('phone');
                $email =$request->getParam('email');
                $gender =$request->getParam('gender');
                $dob = $request->getParam('dob');
                $adhar = $request->getParam('adhar');
                $blood = $request->getParam('bgroup');
                $country = $request->getParam('country');
                $state = $request->getParam('state');
                $city = $request->getParam('city');

                $values = array("Name" => "$name", 'Phone' => "$phone", 'Email' => "$email", 'BGroup' => "$blood", 'Gender' => "$gender", 'AdharNumber' => "$adhar", 'DOB' => "$dob", 'Country' => "$country", 'State' => "$state", 'City' => "$city");
                $newedit = $fm->newEditCommand($layout_name, $recId, $values);
                $result = $newedit->execute();
                if (FileMaker::isError($result)) {
                    $data_unfound = array('message' => 'record did  not match',  'status'=> '400');
                    return $newResponse = $response->withJson($data_unfound,400);
                }
                if( $result == true){
                    $data = array("ID" => "$ID", "Name" => "$name", 'Phone' => "$phone", 'Email' => "$email", 'BloodGroup' => "$blood", 'Gender' => "$gender", 'Adhar' => "$adhar", 'DOB' => "$dob", 'Country' => "$country", 'State' => "$state", 'City' => "$city");
                    return $newResponse = $response->withJson($data, 200);
                }
            }        
        }
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound,401);
    }
});

$app->put('/filemaker/api/doctor/updateAvailability', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $secret = "secretkey";

    try{
        global $fm;
        $token = new token\bearer();
        $tok = $token->getBearerToken();
        $jwt = new auth\jwt();
        $payload = $jwt->decode($tok, $secret, ['HS256']);

        $layout_name = 'User_LIST';
        $find = $fm->newFindCommand($layout_name);
        $find->addFindCriterion('Email',"==".$payload->userName);
        $find->setLogicalOperator(FILEMAKER_FIND_AND);
        $res = $find->execute();
        if (FileMaker::isError($res)) {
            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
            //return $newResponse = $response->withJson($data_unfound,400);
        }
        if($res){
            $id =$request->getParam('id2');
            $day =$request->getParam('day');
            $mode =$request->getParam('mode');
            $shift =$request->getParam('shift');
            $time =$request->getParam('timeslot');
            $patienttime=$request->getParam("patientTime");

            $layout = 'doctor_AVAILABLE';
            $find = $fm->newFindCommand($layout);
            $find->addFindCriterion('__kf_DoctorId',"==".$id);
            $find->setLogicalOperator(FILEMAKER_FIND_AND);
            $res1 = $find->execute();

            if (FileMaker::isError($res1)) {
                $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                //return $newResponse = $response->withJson($data_unfound,400);
            }

            if($res1){
                $record = $res1->getRecords()[0]->_impl;
                $recId = $record->getRecordId();

                $values = array("__kf_DoctorId" => "$id", 'Day' => "$day", "ConsultMode" => "$mode", 'TimeSlot' => "$time", 'PatientTime' => "$patienttime", 'Shift' => "$shift");
                $newedit = $fm->newEditCommand($layout, $recId, $values);
                $result = $newedit->execute();
                if (FileMaker::isError($result)) {
                    $data_unfound = array('message' => 'record did  not match',  'status'=> '400');
                    return $newResponse = $response->withJson($data_unfound,400);
                }
                if($result == true){
                    $data = array("ID" => "$id", "Shift" => "$shift", "Day" => "$day", "Mode" => "$mode", "TimeSlot"=> "$time", "PatientTime"=> "$patienttime");
                    return $newResponse = $response->withJson($data, 200);
                }
            }        
        }
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound,401);
    }
});

$app->post('/filemaker/api/doctor/add/availability', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $secret = "secretkey";
    $type = "Doctor";

    try{        
        global $fm;
        $token = new token\bearer();
        $tok = $token->getBearerToken();
        $jwt = new auth\jwt();
        $payload = $jwt->decode($tok, $secret, ['HS256']);

        $layout = 'User_LIST';
        $find = $fm->newFindCommand($layout);
        $find->addFindCriterion('Email',"==".$payload->userName);
        $find->addFindCriterion('UserType',"==".$type);
        $find->setLogicalOperator(FILEMAKER_FIND_AND);
        $res = $find->execute();

        if (FileMaker::isError($res)) {
            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
            //return $newResponse = $response->withJson($data_unfound,400);
        }
        if($res){
            $rec = $res->getRecords();
            foreach($rec as $record){
                $data1 = array("Availablity" => "True", "Status" => $record->getField('Status'), "UserType" => $record->getField('UserType'), "ID" => $record->getField('__Kp_UserId'), "Name"=> $record->getField('Name'), "Email"=> $record->getField('Email'), "Gender"=> $record->getField('Gender'), "DOB"=> $record->getField('DOB'), "Adhar"=> $record->getField('AdharNumber'), "Phone"=> $record->getField('Phone'), "Country"=> $record->getField('Country'), "State"=> $record->getField('State'), "City"=> $record->getField('City'), "Specialization"=> $record->getField('Specialization'), "BloodGroup"=>$record->getField('BGroup'), "Experience"=> $record->getField('Experience'), "Qualification"=> $record->getField('Qualification'));
            }
            $layout_name = 'doctor_AVAILABLE';
            $id =$request->getParam('id2');
            $day =$request->getParam('day');
            $mode =$request->getParam('mode');
            $shift =$request->getParam('shift');
            $time =$request->getParam('timeslot');
            $patienttime=$request->getParam("patientTime");

            $values = array("__kf_DoctorId" => "$id", 'Day' => "$day", "ConsultMode" => "$mode", 'TimeSlot' => "$time", 'PatientTime' => "$patienttime", 'Shift' => "$shift");
            $record = $fm->createRecord($layout_name, $values);
            if(FileMaker::isError($record)){
                die('Error - ' . $rec->getCode() . ' ' . $rec->getMessage());
            }
            $result = $record->commit();
            if (FileMaker::isError($result)) {
                $data_unfound = array('message' => 'something is wrong',  'status'=> '400');
                return $newResponse = $response->withJson($data_unfound,400);
            }
            if($result == true){
                $find = $fm->newFindCommand($layout_name);
                $find->addFindCriterion('__kf_DoctorId',"==".$id);
                $find->setLogicalOperator(FILEMAKER_FIND_AND);
                $res1 = $find->execute();
                if (FileMaker::isError($res1)) {
                    $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                    //return $newResponse = $response->withJson($data_unfound,400);
                }
                if($res1){
                    $rec = $res1->getRecords();
                    foreach($rec as $record){
                        $data2 = array("ID" => $record->getField('__kf_DoctorId'), "Shift" => $record->getField('Shift'), "Day" => $record->getField('Day'), "Mode" => $record->getField('ConsultMode'), "TimeSlot"=> $record->getField('TimeSlot'), "Day"=> $record->getField('Day'),"PatientTime"=> $record->getField('PatientTime'));
                    }
                }
            }
            return $newResponse = $response->withJson(array_merge($data1,$data2), 201);
        }       
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound, 401);
    }
});

$app->post('/filemaker/api/changepassword', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $id =$request->getParam('id');
    $oldPassword = $request->getParam('oldPassword');
    $newPassword =$request->getParam('password');
    $cnfPassword =$request->getParam('cnf_pass');
    $secret = "secretkey";

    try{
        global $fm;
        $token = new token\bearer();
        $tok = $token->getBearerToken();
        $jwt = new auth\jwt();
        $payload = $jwt->decode($tok, $secret, ['HS256']);

        $layout_name = 'User_LIST';
        $find = $fm->newFindCommand($layout_name);
        $find->addFindCriterion('Email',"==".$payload->userName);
        $find->addFindCriterion('__Kp_UserId',"==".$id);
        $find->setLogicalOperator(FILEMAKER_FIND_AND);
        $res = $find->execute();
        if (FileMaker::isError($res)) {
            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
            //return $newResponse = $response->withJson($data_unfound,400);
        }
        if($res){
            $rec = $res->getRecords();
            foreach($rec as $record){

                $salt = "usernameDOBlocation";
                $pass_secure = hash('gost', $oldPassword.$salt);

                if($record->getField('Password') == $pass_secure){
                    $salt = "usernameDOBlocation";
                    $pass = hash('gost', $newPassword.$salt);
                    $record->setField('Password',$pass);
                    $newResult = $record->commit();

                    if (FileMaker::isError($newResult)) {
                        $data_unfound = array('message' => 'record did  not match',  'status'=> '400');
                        return $newResponse = $response->withJson($data_unfound,400);
                    }
                    if($newResult == true){
                        $data = array('message' => 'Password successfully changed',  'status'=> '200');
                        return $newResponse = $response->withJson($data, 200);
                    }
                }
            }        
        }
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound,401);
    }
});

$app->post('/filemaker/api/doctorlist', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $secret = "secretkey";

    try{
        global $fm;
        // $token = new token\bearer();
        // $tok = $token->getBearerToken();
        // $jwt = new auth\jwt();
        // $payload = $jwt->decode($tok, $secret, ['HS256']);
        
        $layout_name = 'User_LIST';
        // $find = $fm->newFindCommand($layout_name);
        // $find->addFindCriterion('Email',"==".$payload->userName);
        // $find->setLogicalOperator(FILEMAKER_FIND_AND);
        // $res = $find->execute();
        // $rec = $res->getRecords();

        // if (FileMaker::isError($rec)) {
        //     $data_unfound = array('message' => 'something is wrong',  'status'=> '400');
        //     return $newResponse = $response->withJson($data_unfound);
        // }
        
        // if($rec){
            $specialization = $request->getParam('specialization');

            $findcommand = $fm->newFindCommand($layout_name);
            $findcommand->addFindCriterion('Specialization',"==".$specialization);
            $findcommand->addFindCriterion('Status',"=="."Accepted");
            $findcommand->addFindCriterion('Availablity',"=="."True");
            $findcommand->setLogicalOperator(FILEMAKER_FIND_AND);
            $result = $findcommand->execute();
            
            $doctors = [];

            if (FileMaker::isError($result)) {
                $data_unfound = array('message' => 'something is wrong',  'status'=> '400');
                return $newResponse = $response->withJson($data_unfound);
            }
            
            if($result){
                $records = $result->getRecords();
                foreach($records as $record){

                    $layout = 'doctor_AVAILABLE';
                    $find = $fm->newFindCommand($layout);
                    $find->addFindCriterion('__kf_DoctorId',"==".$record->getField('__Kp_UserId'));
                    $find->setLogicalOperator(FILEMAKER_FIND_AND);
                    $res = $find->execute();
    
                    if (FileMaker::isError($res)) {
                        $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                        // return $newResponse = $response->withJson($data_unfound,400);
                    }       
             
                    if($res){
                        $recs = $res->getRecords();
                        foreach($recs as $rec){
                            $data2 = array("Shift" => $rec->getField('Shift'), "Day" => $rec->getField('Day'), "Mode" => $rec->getField('ConsultMode'), "TimeSlot"=> $rec->getField('TimeSlot'), "Day"=> $rec->getField('Day'),"PatientTime"=> $rec->getField('PatientTime'));
                        }
                    }
                   // $data1 = array("Availablity" => $record->getField('Availablity'), "Status" => $record->getField('Status'), "UserType" => $record->getField('UserType'), "ID" => $record->getField('__Kp_UserId'), "Name"=> $record->getField('Name'), "Email"=> $record->getField('Email'), "Gender"=> $record->getField('Gender'), "DOB"=> $record->getField('DOB'), "Adhar"=> $record->getField('AdharNumber'), "Phone"=> $record->getField('Phone'), "Country"=> $record->getField('Country'), "State"=> $record->getField('State'), "City"=> $record->getField('City'), "Specialization"=> $record->getField('Specialization'), "BloodGroup"=>$record->getField('BGroup'), "Experience"=> $record->getField('Experience'), "Qualification"=> $record->getField('Qualification'));
                    $data1 = array("ID" => $record->getField('__Kp_UserId'), "Name"=> $record->getField('Name'), "Email"=> $record->getField('Email'), "Phone"=> $record->getField('Phone'), "Specialization"=> $record->getField('Specialization'), "Experience"=> $record->getField('Experience'), "Qualification"=> $record->getField('Qualification'));
                    array_push($doctors,array_merge($data1,$data2));
                }
            }
            return $newResponse = $response->withJson($doctors,200);
        // }
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound,401);
    }
});

$app->post('/filemaker/api/bookAppointment', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $secret = "secretkey";
    $doctorId =$request->getParam('doctorId');

    try{        
        global $fm;
        $token = new token\bearer();
        $tok = $token->getBearerToken();
        $jwt = new auth\jwt();
        $payload = $jwt->decode($tok, $secret, ['HS256']);

        $layout1 = 'User_LIST';
        $find = $fm->newFindCommand($layout1);
        $find->addFindCriterion('Email',"==".$payload->userName);
        $find->setLogicalOperator(FILEMAKER_FIND_AND);
        $res = $find->execute();

        if (FileMaker::isError($res)) {
            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
            //return $newResponse = $response->withJson($data_unfound,400);
        }
        if($res){
            $find = $fm->newFindCommand($layout1);
            $find->addFindCriterion('__Kp_UserId',"==".$doctorId);
            $find->setLogicalOperator(FILEMAKER_FIND_AND);
            $res1 = $find->execute();

            if (FileMaker::isError($res1)) {
                $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                //return $newResponse = $response->withJson($data_unfound,400);
            }

            if($res1){
                $recs = $res1->getRecords();
                foreach($recs as $rec){
                    $doctorName = $rec->getField('Name');
                }
            }

            $patientId =$request->getParam('patientId');
            $name =$request->getParam('name');
            $email =$request->getParam('email');
            $phone =$request->getParam('phone');
            $status = "Booked";

            $layout2 = 'doctor_AVAILABLE';
            $find = $fm->newFindCommand($layout2);
            $find->addFindCriterion('__kf_DoctorId',"==".$doctorId);
            $find->setLogicalOperator(FILEMAKER_FIND_AND);
            $result = $find->execute();

            if (FileMaker::isError($result)) {
                $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                // return $newResponse = $response->withJson($data_unfound,400);
            }

            if($result){
                $records = $result->getRecords();
                foreach($records as $record){
                    $time = $record->getField('TimeSlot');
                    $patienttime = $record->getField('PatientTime');
                }
            }
            $Time = [];
            $date = date("d/m/Y");
            $next_date = date('d/m/Y', strtotime('now +1 day'));
            // print_r($date);
            // print_r($next_date);
            $layout3 = 'APOINTMENT';
            $find = $fm->newFindCommand($layout3);
            $find->addFindCriterion('__kf_DoctorId',"==".$doctorId);
            $find->addFindCriterion('Date',"==".$next_date);
            $find->setLogicalOperator(FILEMAKER_FIND_AND);
            $result1 = $find->execute();

            if (FileMaker::isError($result1)) {
                $start = intval(substr($time,0,2));
                $timeSlot = $start.":00-".$start.":".substr($patienttime,0,2)." ".substr($time,6,2);
            }
            elseif ($result1){
                $start = intval(substr($time,0,2));
                $records1 = $result1->getRecords();
                foreach($records1 as $record){
                    $timeslot = $record->getField('TimeSlot');
                    array_push($Time,$timeslot);
                }
                $len= count($Time);
                $min = $len * intval(substr($patienttime,0,2));
                if($min < 60){
                    $starthr = $start;
                    $startmin = $min;
                    $endmin = $startmin + intval(substr($patienttime,0,2));
                    if($endmin == 60){
                        $endhr = $starthr +1;
                        $endmin = 00;
                    }else{
                        $endhr = $starthr;
                    }
                }elseif($min == 60){
                    $starthr = $start + 1;
                    $startmin = 00;
                    $endhr = $starthr;
                    $endmin = intval(substr($patienttime,0,2));
                }elseif($min > 60 && $min < 120){
                    $starthr = $start + 1;
                    $startmin = $min - 60;
                    $endmin = $startmin + intval(substr($patienttime,0,2));
                    if($endmin == 60){
                        $endhr = $starthr + 1;
                        $endmin = 00;
                    }else{
                        $endhr = $starthr;
                    }                    
                }elseif($min == 120){
                    $data_unfound = array('message' => 'Sorry Appointment Full please select another Doctor',  'status'=> '400');
                    return $newResponse = $response->withJson($data_unfound,400);
                }

                $timeSlot = $starthr.":".$startmin."-".$endhr.":".$endmin." ".substr($time,6,2);
            }

            $values = array("Date" => "$next_date", "__kf_DoctorId" => "$doctorId", "__kf_PatientId" => "$patientId", 'PatientName' => "$name", "PatientEmail" => "$email", 'TimeSlot' => "$timeSlot", 'Status' => "$status", 'PatientPhone' => "$phone");
            $record = $fm->createRecord($layout3, $values);
            if(FileMaker::isError($record)){
                die('Error - ' . $rec->getCode() . ' ' . $rec->getMessage());
            }
            $result = $record->commit();
            if (FileMaker::isError($result)) {
                $data_unfound = array('message' => 'something is wrong',  'status'=> '400');
                return $newResponse = $response->withJson($data_unfound,400);
            }
            if($result == true){
                $find = $fm->newFindCommand($layout3);
                $find->addFindCriterion('__kf_DoctorId',"==".$doctorId);
                $find->addFindCriterion('Date',"==".$next_date);
                $find->addFindCriterion('TimeSlot',"==".$timeSlot);
                $find->setLogicalOperator(FILEMAKER_FIND_AND);
                $res1 = $find->execute();
                if (FileMaker::isError($res1)) {
                    $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                    //return $newResponse = $response->withJson($data_unfound,400);
                }
                if($res1){
                    $rec = $res1->getRecords();
                    foreach($rec as $record){
                        $data = array("AppointmentId" => $record->getField('___kp_AppointNum'), "Date" => $record->getField('Date'), "DoctorId" => $record->getField('__kf_DoctorId'), "DoctorName" => "$doctorName", "PatientId" => $record->getField('__kf_PatientId'), "PatientName" => $record->getField('PatientName'), "PatientEmail" => $record->getField('PatientEmail'), "PatientPhone" => $record->getField('PatientPhone'), "TimeSlot"=> $record->getField('TimeSlot'), "Status"=> $record->getField('Status'),"Feedback"=> $record->getField('Feedback'));
                    }
                }
            }
            return $newResponse = $response->withJson($data, 201);
        }       
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound, 401);
    }
});

// disease search api
$app->post('/filemaker/api/search/diseases', function(Request $request, Response $response, array $args)
{

    $dname =$request->getParam('diseasesName');
    $body = $response->getBody();
    
    global $fm;
    try{
        $layout_name = 'DIESEASE';

        $findcommand = $fm->newFindCommand($layout_name);
        $findcommand->addFindCriterion('DiesaseName',"==".$dname);
        $findcommand->setLogicalOperator(FILEMAKER_FIND_AND);
        $result = $findcommand->execute();


        if (FileMaker::isError($result)) {
            $data_unfound = array('message' => 'Disease Not Found');
            return $newResponse = $response->withJson($data_unfound,400);
        }       
 
        if($result){
            $records = $result->getRecords();
            foreach($records as $record){
                $data = array("DiseaseName" => $record->getField('DiesaseName'), "Symptoms" => $record->getField('Symptoms'), "Cause" => $record->getField('Cause'), "RiskFactor" => $record->getField('RiskFactor'), "Overview" => $record->getField('Overview'), "Treatment" => $record->getField('Treatment'), "Medication" => $record->getField('Medication'), "HomeRemedies" => $record->getField('HomeRemedies'));
            }
        }
        return $newResponse = $response->withJson($data, 200);
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound, 401);
    }
});

$app->put('/filemaker/api/appointment/served', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $secret = "secretkey";
    $type = "Doctor";

    try{
        global $fm;
        $token = new token\bearer();
        $tok = $token->getBearerToken();
        $jwt = new auth\jwt();
        $payload = $jwt->decode($tok, $secret, ['HS256']);

        $layout_name = 'User_LIST';
        $find = $fm->newFindCommand($layout_name);
        $find->addFindCriterion('Email',"==".$payload->userName);
        $find->addFindCriterion('UserType',"==".$type);
        $find->setLogicalOperator(FILEMAKER_FIND_AND);
        $res = $find->execute();
        if (FileMaker::isError($res)) {
            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
            //return $newResponse = $response->withJson($data_unfound,400);
        }
        if($res){
            $rec = $res->getRecords();
            if($rec){
                $AppointmentId =$request->getParam('AppointmentId');
                $Date = $request->getParam('Date');
                $DoctorId =$request->getParam('DoctorId');
                $PatientEmail =$request->getParam('PatientEmail');
                $PatientId =$request->getParam('PatientId');
                $PatientName = $request->getParam('PatientName');
                $PatientPhone = $request->getParam('PatientPhone');
                $TimeSlot = $request->getParam('TimeSlot');
                $status = "Served";

                $layout = 'APOINTMENT';
                $findRecord = $fm->newFindCommand($layout);
                $findRecord->addFindCriterion('___kp_AppointNum',"==".$AppointmentId);
                $findRecord->setLogicalOperator(FILEMAKER_FIND_AND);
                $res1 = $findRecord->execute();
                if (FileMaker::isError($res1)) {
                    $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                    //return $newResponse = $response->withJson($data_unfound,400);
                }
                if($res1){
                    $record = $res1->getRecords()[0]->_impl;
                    $recId = $record->getRecordId();
                    
                    $values = array("Date" => "$Date", "__kf_DoctorId" => "$DoctorId", "__kf_PatientId" => "$PatientId", 'PatientName' => "$PatientName", "PatientEmail" => "$PatientEmail", 'TimeSlot' => "$TimeSlot", 'Status' => "$status", 'PatientPhone' => "$PatientPhone", "Feedback" => "");
                    $newedit = $fm->newEditCommand($layout, $recId, $values);
                    $result = $newedit->execute();
                        if (FileMaker::isError($result)) {
                            $data_unfound = array('message' => $result->getMessage(),  'status'=> '400');
                            return $newResponse = $response->withJson($data_unfound,400);
                        }
                        if($result){
                            $data_unfound = array("AppointmentId" =>  $AppointmentId, "Date" => $Date, "DoctorId" => $DoctorId, "PatientId" => $PatientId, 'PatientName' => $PatientName, "PatientEmail" => $PatientEmail, 'TimeSlot' => $TimeSlot, 'Status' => $status, 'PatientPhone' => $PatientPhone, "Feedback" => "");
                            return $newResponse = $response->withJson($data_unfound, 200);
                        }
                    }
            }        
        }
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound,401);
    }
});

$app->put('/filemaker/api/appointment/add/feedback', function(Request $request, Response $response, array $args)
{
    $body = $response->getBody();
    $secret = "secretkey";
    $type = "Patient";

    try{
        global $fm;
        $token = new token\bearer();
        $tok = $token->getBearerToken();
        $jwt = new auth\jwt();
        $payload = $jwt->decode($tok, $secret, ['HS256']);

        $layout_name = 'User_LIST';
        $find = $fm->newFindCommand($layout_name);
        $find->addFindCriterion('Email',"==".$payload->userName);
        $find->addFindCriterion('UserType',"==".$type);
        $find->setLogicalOperator(FILEMAKER_FIND_AND);
        $res = $find->execute();
        if (FileMaker::isError($res)) {
            $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
            //return $newResponse = $response->withJson($data_unfound,400);
        }
        if($res){
            $rec = $res->getRecords();
            if($rec){
                $AppointmentId =$request->getParam('appointmentId');
                $feedback = $request->getParam('feedback');

                $layout = 'APOINTMENT';
                $findRecord = $fm->newFindCommand($layout);
                $findRecord->addFindCriterion('___kp_AppointNum',"==".$AppointmentId);
                $findRecord->setLogicalOperator(FILEMAKER_FIND_AND);
                $res1 = $findRecord->execute();
                if (FileMaker::isError($res1)) {
                    $data_unfound = array('message' => 'Record Not Found',  'status'=> '400');
                    //return $newResponse = $response->withJson($data_unfound,400);
                }
                if($res1){
                    $record = $res1->getRecords()[0]->_impl;
                    $recId = $record->getRecordId();
                    
                    $values = array("Feedback" => "$feedback");
                    $newedit = $fm->newEditCommand($layout, $recId, $values);
                    $result = $newedit->execute();
                        if (FileMaker::isError($result)) {
                            $data_unfound = array('message' => $result->getMessage(),  'status'=> '400');
                            return $newResponse = $response->withJson($data_unfound,400);
                        }
                        if($result){
                            $data = array("AppointmentId" =>  $AppointmentId, "Feedback" => $feedback);
                            return $newResponse = $response->withJson($data, 200);
                        }
                    }
            }        
        }
    }catch(EXception $e){
        $data_unfound = array('message' => 'Authorization error',  'status'=> '401');
        return $newResponse = $response->withJson($data_unfound,401);
    }
});



?>