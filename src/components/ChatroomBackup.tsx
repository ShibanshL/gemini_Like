import {useState, useEffect} from 'react'
import { useLocation } from 'react-router'
import SettingIcon from '../assets/setting.png'
import SendIcon from  '../assets/send.png'
import MenuIcon from '../assets/menu.png'
import AddIcon from '../assets/add.png'
import DownIcon from '../assets/down.png'
import DeleteIcon from '../assets/delete.png'
import DeleteGrayIcon from '../assets/delete_Gray.png'
import GeminiSVG from '../assets/gemini.svg'
import GeminiGif from '../assets/gemini.gif'
import { useNavigate } from 'react-router'
import TypingEffect from './TypingEffect'

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
}

function Chatroom() {
    // const [search, setSearch] = useState('')
    const [sideBar, setSideBar] = useState(false)

    const [chatHistory, setChatHistory] = useState<any>([])

    const [messages, setMessages] = useState<Messages[]>([])

    const [chat, setChat] = useState('')

    const [currentTitle, setCurrentTitle] = useState('')

    const [chatResult, setChatResult] = useState(false)

    const [typingDone, setTypingDone] = useState(false)

    const [mobileSidebar, setMobileSidebar] = useState(false)

    const [notif, setNotif] = useState(false)

    const currentTime = new Date();

    const formattedTime = formatTimestamp(currentTime);
    // const sidebarW = useRef('')

    const nav = useNavigate()

    const [user, setUser] = useState<USER>({
        name:'',
        password:''
    })

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
        if(chat){
            setMessages([...messages,{sender:'User',message:chat}])
        }
    }

    const SubmitData = () => {
        if(chat){
            if(imageData) setImageData(null)
            // setChatResult(false)
            setChatHistory([...chatHistory, chat])
            setCurrentTitle(chat)
            setChat('')
            setChatResult(true)
        }
    }

    const PushData = (e:string) => {
        // if(chat){
            // setChatHistory([...chatHistory, chat])
            setCurrentTitle(e)
            setChat('')
            setChatResult(true)
            setImageData(null)
        // }
    }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      SubmitData();
    }
  };

 const deleteItem = (indexToDelete: number): void => {
    setChatHistory(chatHistory.filter((_item: string, index: number): boolean => index !== indexToDelete));
    setNotif(true)
  };

  useEffect(() => {
    if(messages[messages.length - 1]?.sender == 'User'){
        setMessages([...messages,{sender:'bot',message:`This is just psuedo text that is being displayed over here which is not fetching or receiving anything we are just simulating what it'd look like if we were using the real gemini. This here is a small product where the chat room data will persist, so will the user unless and until the user logs out. One can upload images here too to see the name, type and size of the given image.`}])

    }
  },[messages])

  useEffect(() => {
    setTimeout(() => {
            setNotif(false)
    }, 2000);
  },[notif])

    useEffect(() => {
        if(location.state.name && location.state.password){
            // alert('in')
            setUser(location.state)
            localStorage.setItem("User",JSON.stringify(location.state))
        }
    },[])

    useEffect(() => {

        const userData = localStorage.getItem('User')

        if(userData && (JSON.parse(userData).name && JSON.parse(userData).password)){
            // alert('in')
            setUser(JSON.parse(userData))
            // localStorage.setItem("User",JSON.stringify(location.state))
        }
    },[])

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
            style={{ [`--element-width`]: sideBar && '300px' }}>
                <button onClick={() => setSideBar(!sideBar)}>
                    <img src={MenuIcon} style={{width:'20px'}} alt="error404" />
                </button>
                <div className="ChatHistory" style={{ [`--element-opacity`]: sideBar && '1' }}>
                    <h3>Recent</h3>
                    {chatHistory.length > 0 && chatHistory.map((e:string, idx:number) => {
                        return(
                            <>
                            <div className="Chat_H_Options" 
                            // onClick={() => PushData(e)}
                            >
                                <p onClick={() => PushData(e)}>{e.slice(0, 18) + '...'}</p>
                                <img src={DeleteGrayIcon} style={{width:'30px', position:'relative', zIndex:2}} alt="error404" onClick={() => deleteItem(idx)}/>
                            </div>
                            </>
                        )
                    })}
                </div>
                <button id='Delete' style={sideBar?{background:'rgb(189, 46, 46)', cursor:'pointer'}:{background:'none'}} onClick={() => setChatHistory([])}>
                    {sideBar ? 
                    (<>
                        <img src={DeleteIcon} style={{width:'20px'}} alt="error404" />
                        <label htmlFor="" style={sideBar?{opacity:1, transition:'0.5s ease'}:{opacity:0, transition:'0.5s ease'}}>Delete All</label>
                    </>)
                    :
                    <img src={DeleteIcon} style={{width:'20px'}} alt="error404" />}
                </button>
                <button>
                    <img src={SettingIcon} style={{width:'20px'}} alt="error404" />
                </button>
            </div>
            <div className="MainChat" onClick={() => {setSideBar(false)}}>
                <div className="MobileSideBar"  style={{ [`--element-width-M`]: mobileSidebar && '0' }}>
                    <button className='MobileSideBarButton_I' onClick={() =>{setMobileSidebar(!mobileSidebar)}}>
                        <img src={MenuIcon} style={{width:'20px'}} alt="error404" />
                    </button>
                    <div className="ChatHistory" style={{ [`--element-opacity`]:  '1' }}>
                        <h3>Recent</h3>
                        {chatHistory.length > 0 && chatHistory.map((e:string, idx:number) => {
                            return(
                                <>
                                <div className="Chat_H_Options">
                                    <p>{e.slice(0, 18) + '...'}</p>
                                    <img src={DeleteGrayIcon} style={{width:'30px'}} alt="error404" onClick={() => deleteItem(idx)}/>
                                </div>
                                </>
                            )
                        })}
                    </div>
                    <button id='Delete' style={sideBar?{background:'rgb(189, 46, 46)', cursor:'pointer'}:{background:'none'}} onClick={() => setChatHistory([])}>
                        {sideBar ? 
                        (<>
                            <img src={DeleteIcon} style={{width:'20px'}} alt="error404" />
                            <label htmlFor="" style={sideBar?{opacity:1, transition:'0.5s ease'}:{opacity:0, transition:'0.5s ease'}}>Delete All</label>
                        </>)
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
                    {/* <div className="HeaderButtons"> */}
                        <button className='Update' onClick={logout}>Logout</button>
                        {/* <button className='Update'>Upgrade</button> */}

                        <div className='UserIcon'>{user.name.charAt(0).toUpperCase()}</div>
                    {/* </div> */}
                </div>
                <div className="Heading">
                   {!chatResult? <h1>Hello, {user.name} !</h1>:
                   imageData?
                   (
                    <>
                        <div className="ImgUploaded">
                            <img
                                src={imageData.base64}
                                alt="Uploaded"
                                // style={{ maxWidth: '300px', height: 'auto', border: '1px solid #ccc' }}
                            />
                            <label>Image name : <strong>{imageData.name}</strong></label>
                            <label>Image Size : <strong>{imageData.sizeKB} KB</strong></label>
                            <h3>Sorry we don't persist images.</h3>
                        </div>
                   
                        {/* <p>{JSON.stringify(imageData)}</p> */}
                    </>
                   ):
                   (
                    <div className='ChatReceived'>
                        <div className="UserChat">
                            <div className='UserIcon'>{user.name.charAt(0).toUpperCase()}</div>
                            {/* <p dangerouslySetInnerHTML={{ __html: '<strong>Hello</strong> world!' }} /> */}
                            {/* <TypingEffect text={chatHistory[chatHistory.length-1]} speed={75} /> */}
                            {/* <p>{chatHistory[chatHistory.length-1]}</p> */}
                            <p>{currentTitle}</p>
                        </div>
                        <div className='AI_Reply'>
                            <div className="Gemini_Text">
                                <img src={typingDone?GeminiSVG:GeminiGif}  style={!typingDone?{width:'25px'}:{width:'25px'}} alt="" />
                                <p>Gemini is {!typingDone?'typing':'Done'}</p>
                            </div>
                        
                            <div className="AI_Reply_Sub">
                                <TypingEffect
                                    speed={20}
                                    onComplete={() => setTypingDone(true)}
                                >
                                    {/* <b>{user.name} ,</b>  */}
                                    This is just psuedo text that is being displayed over here which is not fetching or receiving anything we are just simulating what it'd look like if we were using the real gemini.
                                    <br></br>
                                    <strong></strong>
                                    This here is a small product where the chat room data will persist, so will the user unless and until the user logs out. One can upload images here too to see the name, type and size of the given image.
                                    {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque quasi inventore cum accusantium eveniet mollitia explicabo, esse et libero vero corrupti dolorem quam iste officia fugit ad eligendi labore? Quibusdam repellendus tempora magnam hic culpa inventore repellat quas veritatis at saepe modi, numquam, enim placeat, et incidunt. Ut, dolorum numquam. Laudantium, vel accusamus. Sunt error omnis praesentium suscipit dignissimos eligendi voluptatem labore adipisci fuga quidem nihil minus animi dolorum perspiciatis vero minima eaque, sapiente iusto quasi. Alias eligendi tenetur optio velit quos laborum rerum a, qui iste ab sequi odio obcaecati mollitia, ipsa impedit neque aliquid molestiae iure? Asperiores dolores perferendis soluta, facere mollitia veritatis doloremque voluptates tempora ab animi dicta ad impedit quibusdam quos qui corrupti doloribus! Perferendis laudantium veniam et sit consectetur veritatis, distinctio repellendus quo qui facere similique laboriosam illo maiores, quos hic consequatur at dolorum nihil assumenda ea inventore. Eum ea a perferendis, sapiente illo praesentium nam, asperiores nihil enim est, blanditiis voluptates! Cumque, nulla impedit sunt animi numquam quas! Rerum dolore nam corporis sequi sapiente similique, voluptatem perspiciatis repudiandae reiciendis dolorem illo provident adipisci quam, expedita repellat ducimus optio vero ut debitis eaque quisquam eveniet cupiditate assumenda. Doloremque provident non dicta quas doloribus quod asperiores? */}
                                </TypingEffect>
                                <div className={!typingDone?"AI_Reply_Buttons_O":"AI_Reply_Buttons"} 
                                // style={typingDone?{opacity:1}:{opacity:0}}
                                >
                                    <p>{formattedTime}</p>
                                    {/* <button></button> */}
                                    {/* <button></button> */}

                                </div>
                                {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, odio. Est illum, enim voluptatem nobis blanditiis voluptates vitae officiis odit aliquid architecto provident eligendi vel iste excepturi nesciunt temporibus sunt laborum nostrum iure rerum. Temporibus, tempora. Nobis aut officia minima adipisci quam iste atque qui nesciunt numquam. Quibusdam, saepe molestias!</p> */}
                                
                            </div>
                        </div>
                    </div>
                   )
                   }
                </div>
                <div className="ChatTag">
                    <div className="ChatTagMainBody">
                        {/* <form action=""> */}
                        <input type="text" placeholder='Ask Gemini' name="" id=""  onKeyDown={handleKeyDown} value={chat} onChange={(e:any) => setChat(e.target.value)} />
                        {/* </form> */}
                        <div className="ChatButons">
                            <div className="ChatOptions">
                                <button className='AddIcon'>
                                    <img src={AddIcon} style={{width:'20px'}} alt="" />
                                </button>
                                <button className='Img_Upload' >
                                    <input type="file" id="fileInput" name="file" accept="image/*" onChange={handleImageUpload} />
                                    Image Upload
                                    {/* <input type="file" name="" id="" style={{opacity:1, width:'100px'}}/> */}
                                </button>
                                {/* <button id="buttons">Canvas</button> */}
                            </div>
                            <div className="SendChat">
                                <button disabled={chat?false:true} onClick={SubmitData}>
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
                left: notif ? '30px':"-100%"
            }}
            >You've deleted the chatroom succefully !</div>
        </div>
    </>
  )
}


function formatTimestamp(date:Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export default Chatroom