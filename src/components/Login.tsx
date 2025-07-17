import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface USER {
    name:string,
    password:string
}

function Login() {

    const [userData, setUserdata] = useState<USER>({
        name:'',
        password:''
    })

    const [phoneNumber, setPhoneNumber] = useState('')

    const [loginClk, setLoginClk] = useState(false)

    const [phNoClk, setPhNoClk] = useState(false)

    const [otpSent, setOtpSent] = useState(false)

    const [otp, setOtp] = useState('')

    const nav = useNavigate()

    //This checks in localstorage if user is presenet if so then it navigates to the AI chatroom
    useEffect(() => {
        const user = localStorage.getItem("User")
        if(user && (JSON.parse(user).name && JSON.parse(user).password)){
            setUserdata(JSON.parse(user))
            Nav()
        }
    },[])

    //This is to simulate otp functionality of the login page
    useEffect(() => {
        setTimeout(() => {
            if(otpSent) setOtpSent(false)
        },2000)
    },[otpSent])

    useEffect(() => {setOtp('')},[])

    //A reusable component for making input elements for login form
    const userInputNodes = (e:string, v:string) => {
        return (
            <>
                <div className="UserInputs">
                    <label htmlFor="">{e} :</label>
                    <input type={v == 'name'?"text":"password"} value={v == 'name'?userData.name:userData.password} placeholder={v == 'name'?'Enter Username / Email':'Enter Password'} onChange={(e:any) => setUserdata({...userData, [`${v}`]:e.target.value})} />
                </div>
            </>
        )
    }

    //This function is to navigate to AI chatroom once logged in.
    const Nav = () => {
        return nav('/chat',{state:userData})
    }

  return (
    <>
        <div className="LoginPage">
            <div className="Login_Tab">
                <div className="Login_P1">
                    <h1>LOGIN</h1>
                    {userInputNodes('Name', 'name')}
                    {userInputNodes('Password', 'password')}
                    <button disabled={userData.name && userData.password ? false : true} onClick={() => setLoginClk(true)}>LOGIN</button>
                </div>
                <div className="Login_P2"
                style={{ [`--element-pos` as any]: loginClk && '0%' }}
                >
                    <h1>Please enter your valid phone Number with correct country code.</h1>
                    <PhoneInput
                        defaultCountry="in"
                        value={phoneNumber}
                        onChange={(phone) => setPhoneNumber(phone)}
                    />
                    <button id='ph_Submit' disabled={phoneNumber.length === 10 ?true:false} onClick={() => {setPhNoClk(true); setTimeout(() => setOtpSent(true),1000)}}>SUBMIT</button>
                </div>
                <div className="Login_P3"
                  style={{ [`--element-pos_1` as any]: phNoClk && '0%' }}
                  >
                    <h1>Please type the OTP.</h1>

                    <div className="OTP_inputs">
                        <input type="number" placeholder='Enter the OTP' value={otp} onChange={(e:any) => setOtp(e.target.value)}/>
                    </div>
                     <div className="FakeText">
                        <button disabled={JSON.stringify(otp).length < 8 ? true:false} onClick={() => {
                            Nav()
                        }}>VERIFY</button>
                        
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
                left: otpSent ? '30px':"-100%"
            }}
            >
                <h3>OTP Sent to the mobile number.</h3>
            </div>
        </div>
    </>
  )
}

export default Login