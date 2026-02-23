

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { getConnectedBrokers, updateBrokerStatus } from '../../data/AlogoTrade/brokerService';

const BrokerLogin = () => {
  const { brokerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/brokers';

  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(1); 
  const [btnLoading, setBtnLoading] = useState(false);

  // ✅ 1. NAYE STATES ADD KIYE GAYE HAIN
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [pin, setPin] = useState(new Array(6).fill(""));

  useEffect(() => {
    const fetchBroker = async () => {
      try {
          const brokers = await getConnectedBrokers();
          const foundBroker = brokers.find(b => b._id === brokerId || b.id === brokerId);
          
          if (foundBroker) {
              setBroker(foundBroker);
          } else {
              navigate(redirectPath);
          }
      } catch (error) {
          console.error("Error fetching broker", error);
          navigate(redirectPath);
      } finally {
          setLoading(false);
      }
    };
    fetchBroker();
  }, [brokerId, navigate, redirectPath]);

  // --- HANDLERS FOR SIMULATION ---
  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if(!mobile) return;
    setBtnLoading(true);
    setTimeout(() => { setStep(2); setBtnLoading(false); }, 1000);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if(otp.join("").length < 6) return;
    setBtnLoading(true);
    setTimeout(() => { setStep(3); setBtnLoading(false); }, 1000);
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if(pin.join("").length < 6) return;
    setBtnLoading(true);
    
    try {
        await updateBrokerStatus(brokerId, true); 
        setTimeout(() => {
            navigate(redirectPath); 
        }, 1500);
    } catch (error) {
        alert("Login Failed");
        setBtnLoading(false);
    }
  };

  // ✅ 2. OTP/PIN AUTO-FOCUS LOGIC
  const handleOtpChange = (element, index, type) => {
      if (isNaN(element.value)) return; // Sirf numbers allow karein

      if(type === 'otp') {
          setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
      } else {
          setPin([...pin.map((d, idx) => (idx === index ? element.value : d))]);
      }

      // Type karne par next box me focus bhejen
      if (element.nextSibling && element.value !== "") {
          element.nextSibling.focus();
      }
  };

  const handleBackspace = (e, index, type) => {
      if (e.key === "Backspace") {
          const stateArray = type === 'otp' ? otp : pin;
          
          // Agar current box khali hai, to pichle box par wapas jao
          if (stateArray[index] === "" && e.target.previousSibling) {
              e.target.previousSibling.focus();
          }
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Secure Portal...</div>;
  if (!broker) return null;

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-4 font-sans">
      
      <div className="bg-white w-full max-w-[900px] h-[550px] rounded-2xl shadow-xl flex overflow-hidden relative">
        
        {/* LEFT SIDE */}
        <div className="w-1/2 bg-gradient-to-br from-[#13111C] to-[#2A2638] p-10 flex flex-col justify-between text-white relative overflow-hidden hidden md:flex">
            <div className="z-10">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <div className="bg-white p-1 rounded-lg">
                       <img src={broker.logo} alt={broker.name} className="w-8 h-8 object-contain" />
                    </div>
                    {broker.name}
                </h1>
                <h2 className="text-2xl font-semibold mt-8">Generate Access</h2>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    Login via your {broker.name} account to authenticate and access trading via APIs securely.
                </p>
            </div>
            
            <div className="z-10 flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <ShieldCheck size={30} className="text-green-400" />
                <div>
                   <h4 className="font-bold text-sm">256-bit Encryption</h4>
                   <p className="text-xs text-gray-400">Your connection is fully secure.</p>
                </div>
            </div>

            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
            <button onClick={() => navigate(redirectPath)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors flex items-center gap-1 text-sm font-medium">
                <ArrowLeft size={16}/> Cancel
            </button>

            {/* --- STEP 1: MOBILE --- */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right duration-300">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 p-2">
                        <img src={broker.logo} alt={broker.name} className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login via {broker.name}</h2>
                    <form onSubmit={handleMobileSubmit}>
                        <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number / Client ID</label>
                        
                        {/* ✅ FIX: Value aur onChange add kiya + Text color dark kiya */}
                        <input 
                            type="text" 
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder={`Enter ${broker.name} details`} 
                            className="w-full p-3.5 border border-gray-300 text-gray-900 rounded-lg mt-1 mb-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                            required 
                        />
                        
                        <button disabled={btnLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-all flex justify-center shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-70">
                            {btnLoading ? "Processing..." : "Proceed"}
                        </button>
                    </form>
                </div>
            )}

            {/* --- STEP 2: OTP --- */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right duration-300 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 p-2">
                        <img src={broker.logo} alt={broker.name} className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify with OTP</h2>
                    <p className="text-gray-500 text-sm mb-6">Enter the OTP sent to your Reg. Mobile Number</p>
                    <form onSubmit={handleOtpSubmit}>
                        <div className="flex justify-center gap-2 mb-6">
                            
                            {/* ✅ FIX: Smooth OTP Input Logic */}
                            {otp.map((data, index) => (
                                <input 
                                    key={index} 
                                    type="text" 
                                    maxLength="1" 
                                    value={data}
                                    onChange={e => handleOtpChange(e.target, index, 'otp')}
                                    onKeyDown={e => handleBackspace(e, index, 'otp')}
                                    className="w-10 h-10 border border-gray-300 text-gray-900 rounded-md text-center text-lg font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" 
                                    required 
                                />
                            ))}

                        </div>
                        <button disabled={btnLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-all flex justify-center shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-70">
                            {btnLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                </div>
            )}

            {/* --- STEP 3: PIN --- */}
            {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right duration-300 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg shadow-green-500/30 border-4 border-green-100">
                        S
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, SUNIL</h2>
                    <p className="text-gray-500 text-sm mb-6">Enter {broker.name} PIN / T-PIN</p>
                    <form onSubmit={handlePinSubmit}>
                        <div className="flex justify-center gap-3 mb-8">
                            
                            {/* ✅ FIX: Smooth PIN Input Logic */}
                            {pin.map((data, index) => (
                                <input 
                                    key={index} 
                                    type="password" 
                                    maxLength="1" 
                                    value={data}
                                    onChange={e => handleOtpChange(e.target, index, 'pin')}
                                    onKeyDown={e => handleBackspace(e, index, 'pin')}
                                    className="w-10 h-10 border border-gray-300 text-gray-900 rounded-md text-center text-lg font-bold focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors" 
                                    required 
                                />
                            ))}

                        </div>
                        <button disabled={btnLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg transition-all flex justify-center shadow-lg shadow-green-500/30 active:scale-95 disabled:opacity-70">
                            {btnLoading ? "Authenticating..." : "Connect Terminal"}
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
      
      <div className="fixed bottom-4 text-center w-full text-xs text-gray-400">
          Secure Authorization Portal • TradeMaster
      </div>
    </div>
  );
};

export default BrokerLogin;