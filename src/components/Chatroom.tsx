import {useState, useEffect, useRef} from 'react'
import { useLocation } from 'react-router'
import SettingIcon from '../assets/setting.png'
import SendIcon from  '../assets/send.png'
import MenuIcon from '../assets/menu.png'
import AddIcon from '../assets/add.png'
import DownIcon from '../assets/down.png'
import DeleteIcon from '../assets/delete.png'
import DeleteGrayIcon from '../assets/delete_Gray.png'
import GeminiSVG from '../assets/gemini.svg'
import CopyIcon from '../assets/copy.png'
import GeminiGif from '../assets/gemini.gif'
import { useNavigate } from 'react-router'
import TypingEffect from './TypingEffect'

const Text = `This is just psuedo text that is being displayed over here which is not fetching or receiving anything we are just simulating what it'd look like if we were using the real gemini. This here is a small product where the chat room data will persist, so will the user unless and until the user logs out. One can upload images here too to see the name, type and size of the given image.`

interface USER {
    name:string,
    password:string
}

interface ImageData {
  name: string;
  sizeKB: number;
  base64: string;
}

interface Messages {
    sender:string,
    message:string
    geminiNotif:boolean
}

interface ChatHistory {
  uuID: string;
  chatHeading: string;
  userChats: Messages[];
}

function Chatroom() {

    const [sideBar, setSideBar] = useState(false)

    const [clipBoard, setClipBoard] = useState(false)

    const [dirtyLoad, setDirtyLoad] = useState(0)

    const [chatHistory, setChatHistory] = useState<any>([])

    const [messages, setMessages] = useState<Messages[]>([])

    const [chat, setChat] = useState('')

    const [chatResult, setChatResult] = useState(false)

    const [mobileSidebar, setMobileSidebar] = useState(false)

    const [notif, setNotif] = useState(false)

    const [uniqueID, setUniqueID] = useState('')

    const currentTime = new Date();

    const formattedTime = formatTimestamp(currentTime);

    const nav = useNavigate()

    const [user, setUser] = useState<USER>({
        name:'',
        password:''
    })

    const messagesEndRef:any = useRef(null);

    const location = useLocation()

    const [imageData, setImageData] = useState<ImageData | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
        const base64 = reader.result as string;
        const sizeKB = +(file.size / 1024).toFixed(2);

        setImageData({
            name: file.name,
            sizeKB,
            base64,
        });
        };
        setChatResult(true)
        reader.readAsDataURL(file);
    };


    const logout = () => {
        nav('/')
        localStorage.removeItem('User')
        setUser({
            name:'',
            password:''
        })
    }

    const newSubmitData = () => {
        if(chat.trim() != ''){
            setChatResult(true)
            setMessages([...messages,{sender:'user',message:chat, geminiNotif:false}])
            setChat('')
            setDirtyLoad(dirtyLoad+1)

        }
    }

    const newPushData = (e:ChatHistory) => {
        setChatResult(true)
        setMessages(e.userChats)
        setUniqueID(e.uuID)

    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
        e.preventDefault();
            newSubmitData()
        }
    };

    const setNotifTrue = (indexToUpdate:number) => {
        setMessages((prevMessages) =>
            prevMessages.map((item, index) =>
            index === indexToUpdate ? { ...item, geminiNotif: true } : item
            )
        );
    };

    const updateOrPushChat = (newChat: ChatHistory) => {
        setChatHistory((prevChats:ChatHistory[]) => {
        const exists = prevChats.some(chat => chat.uuID === newChat.uuID);

        if (exists) {
            return prevChats.map(chat =>
            chat.uuID === newChat.uuID
                ? { ...chat, ...newChat }
                : chat
            );
        } else {
            return [...prevChats, newChat];
        }
        });
    };

    const deleteItem = (indexToDelete: number): void => {
        setChatHistory(chatHistory.filter((_item: string, index: number): boolean => index !== indexToDelete));
        setNotif(true)
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages])

    useEffect(() => {
        if(messages.length > 0){
            updateOrPushChat({uuID:uniqueID,chatHeading:messages[0].message,userChats:messages})
        }
    },[dirtyLoad])


    useEffect(() => {
        setTimeout(() => {
            if(notif) setNotif(false)
            if(clipBoard) setClipBoard(false)
        }, 2000);
    },[notif || clipBoard])

    useEffect(() => {
        if(clipBoard) navigator.clipboard.writeText(Text)
    },[clipBoard])

    useEffect(() => {
        if(location.state) {
            if(location.state.name && location.state.password){
                setUser(location.state)
                localStorage.setItem("User",JSON.stringify(location.state))
            }
        }
    },[])

    useEffect(() => {
        const userData = localStorage.getItem('User')
        if(userData && (JSON.parse(userData).name && JSON.parse(userData).password)){
            setUser(JSON.parse(userData))
        }
        else nav('/')
    },[])

    useEffect(() => {
        const id = generateId();
        setUniqueID(id);
    }, []);

    useEffect(() => {
        const chats = localStorage.getItem('Chat_History')

        if(chats && JSON.parse(chats).length > 0){
            setChatHistory(JSON.parse(chats))
        }
    },[])

    useEffect(() => {
        localStorage.setItem('Chat_History',JSON.stringify(chatHistory))
        if(chatHistory.length > 10) {
            let newChatHistory = chatHistory;
            newChatHistory.shift()

            setChatHistory(newChatHistory)
        }
    },[chatHistory])

  return (
    <>
        <div className="MainBody">
            <div className="Sidebar" 
            style={{ [`--element-width` as any]: sideBar && '300px' }}>
                <button onClick={() => setSideBar(!sideBar)}>
                    <img src={MenuIcon} style={{width:'20px'}} alt="error404" />
                </button>
                <div className="ChatHistory" style={{ [`--element-opacity` as any]: sideBar && '1' }}>
                    <h3>Recent</h3>
                    {chatHistory.length > 0 && chatHistory.map((e:any, idx:number) => {
                        return(
                            <>
                                <div className="Chat_H_Options" >
                                    <p onClick={() => newPushData(e)}>{e.chatHeading.length > 18 ?e.chatHeading.slice(0, 18) + '...':e.chatHeading}</p>
                                    <img src={DeleteGrayIcon} style={{width:'30px', position:'relative', zIndex:2}} alt="error404" onClick={() => deleteItem(idx)} />
                                </div>
                            </>
                        )
                    })}
                </div>
                <button id='Delete' style={sideBar?{background:'rgb(189, 46, 46)', cursor:'pointer'}:{background:'none'}} onClick={() => setChatHistory([])}>
                    {sideBar ? 
                    (
                        <>
                            <img src={DeleteIcon} style={{width:'20px'}} alt="error404" />
                            <label htmlFor="" style={sideBar?{opacity:1, transition:'0.5s ease'}:{opacity:0, transition:'0.5s ease'}}>Delete All</label>
                        </>
                    )
                    :
                    <img src={DeleteIcon} style={{width:'20px'}} alt="error404" />}
                </button>
                <button>
                    <img src={SettingIcon} style={{width:'20px'}} alt="error404" />
                </button>
            </div>
            <div className="MainChat" onClick={() => {setSideBar(false)}}>
                <div className="MobileSideBar"  style={{ [`--element-width-M` as any]: mobileSidebar && '0' }}>
                    <button className='MobileSideBarButton_I' onClick={() =>{setMobileSidebar(!mobileSidebar)}}>
                        <img src={MenuIcon} style={{width:'20px'}} alt="error404" />
                    </button>
                    <h3>Recent</h3>
                    <div className="ChatHistory" style={{ [`--element-opacity` as any]:  '1' }}>
                        {chatHistory.length > 0 && chatHistory.map((e:any, idx:number) => {
                            return(
                                <>
                                    <div className="Chat_H_Options"  onClick={() => newPushData(e)}>
                                        <p>{e.chatHeading.length > 18 ?e.chatHeading.slice(0, 18) + '...':e.chatHeading}</p>
                                        <img src={DeleteGrayIcon} style={{width:'30px', position:'relative', zIndex:2}} alt="error404" onClick={() => deleteItem(idx)}/>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                    <button id='Delete' style={sideBar?{background:'rgb(189, 46, 46)', cursor:'pointer'}:{background:'none'}} onClick={() => setChatHistory([])}>
                        {sideBar ? 
                        (
                            <>
                                <img src={DeleteIcon} style={{width:'20px'}} alt="error404" />
                                <label htmlFor="" style={sideBar?{opacity:1, transition:'0.5s ease'}:{opacity:0, transition:'0.5s ease'}}>Delete All</label>
                            </>
                        )
                        :
                        <img src={DeleteIcon} style={{width:'20px'}} alt="error404" />}
                    </button>
                    <button>
                        <img src={SettingIcon} style={{width:'20px'}} alt="error404" />
                    </button>
                </div>
                <div className="Header">
                    <button className='MobileSideBarButton' onClick={() =>{setMobileSidebar(!mobileSidebar)}}>
                        <img src={MenuIcon} style={{width:'20px'}} alt="error404" />
                    </button>
                    <div className="AI_Version">
                        <label>Gemini</label>
                        <button>Ver 2 <img src={DownIcon} style={{width:'10px'}} alt="" /></button>
                    </div>
                        <button className='Update' onClick={logout}>Logout</button>
                        <div className='UserIcon'>{user.name.charAt(0).toUpperCase()}</div>
                </div>
                <div className="Heading">
                   {!chatResult? <h1>Hello, User !</h1>:
                   imageData?
                   (
                    <>
                        <div className="ImgUploaded">
                            <img
                                src={imageData.base64}
                                alt="Uploaded"
                            />
                            <label>Image name : <strong>{imageData.name}</strong></label>
                            <label>Image Size : <strong>{imageData.sizeKB} KB</strong></label>
                            <h3>Sorry we don't persist images. Please reload the page</h3>
                        </div>
                    </>
                   ):
                   (
                    <div className='ChatReceived'>
                        {messages.map((e:Messages, idx:number) => {

                                return <>
                                <div className="UserChat">
                                    <div className='UserIcon'>{user.name.charAt(0).toUpperCase()}</div>
                                    <p>{e.message}</p>
                                </div>
                                <div className='AI_Reply'>
                                    <div className="Gemini_Text">
                                        <img src={e.geminiNotif?GeminiSVG:GeminiGif}  style={!e.geminiNotif?{width:'25px'}:{width:'25px'}} alt="" />
                                        <p>Gemini is {!e.geminiNotif?'typing':'Done'}</p>
                                    </div>
                                    <div className="AI_Reply_Sub">
                                        <TypingEffect
                                            speed={20}
                                            onComplete={() => setNotifTrue(idx)}
                                        >
                                            This is just psuedo text that is being displayed over here which is not fetching or receiving anything we are just simulating what it'd look like if we were using the real gemini.
                                            <br></br>
                                            <strong></strong>
                                            This here is a small product where the chat room data will persist, so will the user unless and until the user logs out. One can upload images here too to see the name, type and size of the given image.
                                        </TypingEffect>
                                        <div className={!e.geminiNotif?"AI_Reply_Buttons_O":"AI_Reply_Buttons"} 
                                        >
                                            <p>{formattedTime}</p>
                                            <img src={CopyIcon} style={{width:'30px'}} onClick={() => setClipBoard(true)} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </>

                        })}
                        <div ref={messagesEndRef} />
                    </div>
                   )
                   }
                </div>
                <div className="ChatTag">
                    <div className="ChatTagMainBody">
                        <input type="text" disabled={imageData?true:false} placeholder='Ask Gemini' name="" id=""  onKeyDown={handleKeyDown} value={chat} onChange={(e:any) => setChat(e.target.value)} />
                        <div className="ChatButons">
                            <div className="ChatOptions">
                                <button className='AddIcon'>
                                    <img src={AddIcon} style={{width:'20px'}} alt="" />
                                </button>
                                <button className='Img_Upload' >
                                    <input type="file" id="fileInput" name="file" accept="image/*" onChange={handleImageUpload} />
                                    Image Upload
                                </button>
                            </div>
                            <div className="SendChat">
                                <button  disabled={imageData?true:false} onClick={newSubmitData}>
                                    <img src={SendIcon} style={{width:'20px'}} alt="error404" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div 
            style={{
                position: "absolute",
                background: "white",
                color: "black",
                fontWeight: 600,
                height: "80px",
                width: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                transition: "0.5s ease",
                bottom: "35px",
                left: notif || clipBoard ? '30px':"-100%"
            }}
            >{clipBoard?`Copied content to clipBoard`:`You've deleted the chatroom succefully !`}</div>
        </div>
    </>
  )
}


const formatTimestamp = (date:Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default Chatroom