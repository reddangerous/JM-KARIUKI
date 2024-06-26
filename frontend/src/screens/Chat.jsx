import { Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetUsersQuery } from '../slices/usersApiSlice';
import { useSendMessageMutation, useGetMessagesByAppointIdQuery } from '../slices/messagesApiSlice';
import { useGetAppointmentBYIDQuery } from '../slices/ApppointmentApiSlice'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import '../Assets/chat.css'
import { IoIosSend } from "react-icons/io";
import { Link } from 'react-router-dom';
import {useGetUserByIdQuery} from '../slices/usersApiSlice';
import { Card } from 'react-bootstrap';
import {useFetchMedicalQuery} from '../slices/medicalApiSlice';

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
    return formattedDate;
  };

const Message =({message, userId}) =>{
    const isMe = message.senderId === userId;

    return(
        <div className={`Message ${isMe ? 'right' : 'left'}`} key={message.messageId}>

            <p style={{color: 'white'}}>{message.messageText}</p>
            <p className='timeStamp' style={{ color: '#C0C0C0', fontSize: '10px' }}>{formatTimestamp(message.timestamp)}</p>

        </div>
    )
}




const Chat = () => {
  const { appointId, id } = useParams();
  //get previous messages
  const {data: messages, loading: messagesLoading} = useGetMessagesByAppointIdQuery(appointId);
  
  const { data: appointment, loading: appointmentLoading } = useGetAppointmentBYIDQuery(appointId);
  const { data: medical, loading: medicalLoading } = useFetchMedicalQuery();

  // Filter the medical for the appoint Id to get the medical info
  const medicalInfo = medical?.find(med => med.appointId === appointId);
 


  const { data: users, loading } = useGetUsersQuery();
  const doctorDetails = users?.find(user => user.userId === id);
  const patientDetails = users?.find(user => user.userId === id);
  const { userInfo } = useSelector(state => state.auth);
  const userId = userInfo?.userId;
  const userTypeLogged = userInfo?.userType;
  const [sendMessage, { isLoading }] = useSendMessageMutation();
 

    const { data: user, isLoading: userIsLoading } = useGetUserByIdQuery(userId);
    console.log(user, 'user')
  const [message, setMessage] = useState('');


  
  const handleSendMessage = async () => {
    // Construct the message object
    const messageData = {
      receiverId: id,
      appointId,
      messageText: message,
    };

    try {
      const res = await sendMessage(messageData);
      console.log(res)
      if (res) {
        toast.success('Message sent successfully');
        setMessage('');
      } else {
        toast.error(res.error?.data?.errMessage);
      }
    } catch (error) {
      toast.error('Error sending message: ' + error.message);
    }
  };

  
  
  // Determine whether to show doctor or patient details
  const userType = doctorDetails?.userType || '';
  const userPatient = patientDetails?.userType || '';
  const isDoctor = userType === 'doctor';
  const isPatient = userPatient === 'patient';
  const userDetails = isDoctor ? doctorDetails: isPatient ? patientDetails : userInfo;
 

  return (
    <div style={{ backgroundColor: '#87CEEB', minHeight: '100vh' }}>
      <Row style={{ marginLeft: '20px', marginRight: '20px' }}>
        <Col md={6} style={{}}>
          <h6 style={{textAlign: "center"}}>{isPatient ? 'Patient Details' : 'Doctor Details'  }</h6>
          <hr style={{ borderTop: '2px solid #000' }} />
          <p>First Name: {userDetails?.firstName}</p>
          <p>Last Name: {userDetails?.lastName}</p>
          <p>Email: {userDetails?.email}</p>

          <hr style={{ borderTop: '2px solid #000' }} />

          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  {
                    userTypeLogged === 'doctor' ? (
                      <p><Link to ={`/user/${appointment?.userId}`} target='_blank'>Patient Profile</Link> </p>
                    ):(
                      <p><a href={`/doc/${appointment?.doctorId}`} target="_blank" rel="noopener noreferrer">Doctor Profile</a></p>

                    )
                  }
                  </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Appointment</strong>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Appointment ID:</strong> {appointId}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Appointment Date:</strong> {appointment?.appointDatetime}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Appointment Status:</strong> {appointment?.appointStatus}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Message:</strong> {appointment?.message}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Created On:</strong> {formatTimestamp(appointment?.timestamp)}
                </ListGroup.Item>
                {appointment?.appointStatus === 'completed' && (
                  <ListGroup.Item>
                    <strong>Completed On:</strong> {formatTimestamp(appointment?.completedOn)}
                  </ListGroup.Item>
                
                )}


 {
                    userTypeLogged === 'patient' ? (
                      <>
<Card style={{ marginTop: '10px', marginLeft: '5px' }}>
            <Card.Body>
                <Card.Title>Prescription</Card.Title>
                <Card.Text>
               

<p>
 {medicalInfo?.prescriptions && medicalInfo.prescriptions.length > 0 ? (
    <>
      <p>Your Prescriptions:</p>
      <ol>
        {medicalInfo.prescriptions.map((prescription, index) => (
          <li key={index}>{prescription}</li>
        ))}
      </ol>
    </>
 ) : (
    <p>No prescriptions</p>
 )}
</p>
<p>Test Results: {medicalInfo?.test_results} </p>

<p>{formatTimestamp(medicalInfo?.timestamp)}</p>

                </Card.Text>
            </Card.Body>
            </Card>
 
            <Card style={{ marginTop: '10px', marginLeft: '5px' }}>
            <Card.Body>
                <Card.Title>Health Data</Card.Title>
                <Card.Text>
                <p>Disabled: {user?.healthData[0]?.disabled ? 'Yes' : 'No'}</p>
                <p>Disability Type: {user?.healthData[0]?.disabilityType}</p>
                <p>Allergies: {user?.healthData[0]?.allergies && user.healthData[0].allergies.length > 0 ? user.healthData[0].allergies.join(', ') : 'None'}</p>
                <p>Chronic Diseases: {user?.healthData[0]?.chronicDiseases && user.healthData[0].chronicDiseases.length > 0 ? user.healthData[0].chronicDiseases.join(', ') : 'None'}</p>
                <p>Diet Type: {user?.healthData[0]?.dietType}</p>
                </Card.Text>
            </Card.Body>
            </Card>
            </>

                    ):(
                      <div></div>
                    )
                  }

                </ListGroup>

              <hr style={{ borderTop: '2px solid #000' }} />
              <Button variant='primary' style={{ width: '100%' }}>
                <Link style={{
                  color: 'white',
                  textDecoration: 'none'

                }} to={`/video/${appointId}`}>
                Start Video Call
                </Link>
                </Button>


            </Col>
          </Row>


        </Col>
        <Col md={6}>
          <h6 style={{textAlign: "center"}}>Messages</h6>
          <hr style={{ borderTop: '2px solid #000' }} />
           <div className='MessageConvo'>
            {messagesLoading ? (
              <p>Loading messages...</p>
            ) : messages?.length === 0 ? (
              <p>No messages yet</p>
            ) : (
              messages?.map((message) => (
                <Message key={message.messageId} message={message} userId={userId} />
              ))
            )}
           </div>
           <Form style={{ display: 'flex', flexDirection: 'column' }}>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Type your message here..."
                style={{ marginBottom: '10px', resize: 'none', overflow: 'hidden', transition: 'height 0.5s' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={(e) => { e.target.rows = 3; }}
                onBlur={(e) => { e.target.rows = 1; }}
              />
              <Button
                variant="primary"
                onClick={handleSendMessage}
                disabled={isLoading}
                style={{ alignSelf: 'flex-end',position:'absolute',  width: 'fit-content', alignItems: 'center', justifyContent: 'center'}}
              >
                <IoIosSend /> 
              </Button>
            </Form>
        </Col>
      </Row>
      <ToastContainer />
    </div>
  );
};

export default Chat;
