import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect,useState,useCallback } from "react";
import { getUsers } from "./Slice/userSlice";
import "./App.css"

function App(){
  const dispatch = useDispatch();
  const [state,setState] = useState({
    name :"",
    mail :""
  });

    const [Permission,setRecordingPermission]= useState(false);
    const [recordingStarted,setRecordingStarted] =useState(false);
    const [screenStream,setSreenStream] = useState(null);
    const [webcamStream,setWebcamStream] = useState(null);
    const [screenRecorder,setScreenREcorder] = useState(null);
    const [webcamRecorder,setWebcamRecorder] = useState(null);
    const [screenChunks,setScreenChunks] = useState(null);
    const  [webcamChunks,setWebcamChunks] = useState(null);
  const fetchUsers = useCallback(async()=>{
    const {data} = await axios.get("http://localhost:5000/API/project");
    dispatch(getUsers(data));
  },[dispatch]);
  const createUser = useCallback(async()=>{
    const  users = await axios.post("http://localhost:5000/API/project",state).then((res)=>{
      console.log(res)
      return res;
    }).catch((err)=>{
      return err
    });
    if(users.status === 200){
      localStorage.setItem("Token",users.data.data);
      setRecordingPermission(true);
    }else if(users.message === "Request failed with status code 400"){
      alert("user already exists...!")
    }
  },[state])
  
  const Confirmation= async()=>{
    try{
        const screenStream = await navigator.mediaDevices.getDisplayMedia({video:true});
        const webcamStream = await navigator.mediaDevices.getUserMedia({video:true});
        setSreenStream(screenStream);
        setWebcamStream(webcamStream);
        const screeenMedia = new MediaRecorder(screenStream);
        const webcamMedia = new MediaRecorder(webcamStream);
        setScreenREcorder(screeenMedia);
        setWebcamRecorder(webcamMedia);
        const screenData = [];
        const webcamData = [];
        screeenMedia.ondataavailable =(event)=>{
            if(event.data.size >0){
                screenData.push(event.data);
            }
        }
        screeenMedia.onstop =()=>{
            const blob = new Blob(screenData,{type:"/video/screen"});
            setScreenChunks(blob);
            localStorage.setItem("screenRecordedVideo",blob);
        }
        webcamMedia.ondataavailable = (event)=>{
            if(event.data.size >0){
                webcamData.push(event.data);
            }
        }
        webcamMedia.onstop = ()=>{
            const blob = new Blob(webcamData,{type:"/video/web"})
            setWebcamChunks(blob);
            localStorage.setItem("webcamrecordedVideo",blob);
        }
        setRecordingStarted(true);
    }
    catch(err){
        console.log(err);
    }
}
  
  const capture = (event)=>{
    var name = event.target.name;
    var value = event.target.value;
    setState({
      ...state,
      [name]:value
    });
  };
  const submitData = (event)=>{
    event.preventDefault();
    dispatch(createUser);
    document.getElementById("name").value = "";
    document.getElementById("mail").value = "";
  };
  const startRecording = ()=>{
    if(screenRecorder && webcamRecorder && (screenRecorder.state && webcamRecorder.state) === 'inactive'){
        screenRecorder.start();
        webcamRecorder.start();
        setRecordingStarted(true);
    }
};
const stopRecording = ()=>{
    if(screenRecorder && webcamRecorder && (screenRecorder.state && webcamRecorder.state)=== 'recording'){
        screenRecorder.stop();
        webcamRecorder.stop();
        setRecordingStarted(false);
        if(screenStream){
            screenStream.getTracks().forEach(track => track.stop());
        }
        if(webcamStream){
            webcamStream.getTracks().forEach(track=>track.stop());
        }
    }
};
useEffect(()=>{
  fetchUsers();
},[fetchUsers])
useEffect(()=>{
    return ()=>{
        if(screenStream){
            screenStream.getTracks().forEach(track => track.stop());
        }
        if(webcamStream){
            webcamStream.getTracks().forEach(track=>track.stop());
        }
    }
    
},[screenStream,webcamStream])
return(
    <div className="form-container">
      {!Permission && (
        <form className="form-container">
        <label className="form-heading">Name:</label> <input className='form-input' id="name" name="name" type="text" onChange={capture} placeholder="Enter Name"></input><br></br><br></br>
        <label className="form-heading">Gmail:</label> <input className="form-input" id="mail" name="mail" onChange={capture} type="text" placeholder="Enter Gmail"></input><br></br><br></br>
         <button className="form-button" onClick={submitData}>Submit</button>
        </form>
      )}
    
    {Permission && !recordingStarted && (
    <div>
      <p className="form-heading">Do you want to start recording?</p>
      <button onClick={Confirmation} className="form-button">get permissions</button>
    </div>
  )}
  {recordingStarted &&  (
        <div>
          <button className="form-button mr"  onClick={startRecording}>Start Recording</button>
          <button className="form-button" onClick={stopRecording}>Stop Recording</button>
        </div>
      )}
            <div className="video">
            {screenChunks &&(
                <video controls src={URL.createObjectURL(screenChunks)}></video>
            )}
            {webcamChunks &&(
                <video controls src={URL.createObjectURL(webcamChunks)}></video>
            )}
            </div>
    </div>
  )
}
export default App;