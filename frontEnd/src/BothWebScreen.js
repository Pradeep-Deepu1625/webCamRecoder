import {useState,useEffect} from "react";
function BothWebAScreen(){
    const [showPermission,setShowPermission]= useState(false);
    const [recordingStarted,setRecordingStarted] =useState(false);
    const [screenStream,setSreenStream] = useState(null);
    const [webcamStream,setWebcamStream] = useState(null);
    const [screenRecorder,setScreenREcorder] = useState(null);
    const [webcamRecorder,setWebcamRecorder] = useState(null);
    const [screenChunks,setScreenChunks] = useState(null);
    const  [webcamChunks,setWebcamChunks] = useState(null);
    const submit = ()=>{
        setShowPermission(true);
    }
    const Confirmation= async()=>{
        setShowPermission(false);
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
            }
            webcamMedia.ondataavailable = (event)=>{
                if(event.data.size >0){
                    webcamData.push(event.data);
                }
            }
            webcamMedia.onstop = ()=>{
                const blob = new Blob(webcamData,{type:"/video/web"})
                setWebcamChunks(blob);
            }
            setRecordingStarted(true);
        }
        catch(err){
            console.log(err);
        }
    }
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

    }
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
        <div>
            <button onClick={submit}>submit</button>
            {showPermission && (
                <button onClick={Confirmation}>get record permission</button>
            )}
            {recordingStarted && (
              <div>
               <button onClick={startRecording}>Start Recording</button>
               <button onClick={stopRecording}>Stop Recording</button>
              </div>  
            )} 
            {screenChunks &&(
                <video controls src={URL.createObjectURL(screenChunks)}></video>
            )}
           {webcamChunks &&(
                <video controls src={URL.createObjectURL(webcamChunks)}></video>
            )}
        </div>
    )
}
export default BothWebAScreen;