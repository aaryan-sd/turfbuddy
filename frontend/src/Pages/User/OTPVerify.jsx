import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OTPVerify() {
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();
  const phone = localStorage.getItem("phone");

  useEffect(() => {
    if (!phone) {
      alert("No phone number found.");
      return;
    }

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => {
            alert("reCAPTCHA expired. Please refresh.");
          },
        },
        auth
      );
    }

    const recaptcha = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, `+91${phone}`, recaptcha)
      .then((confirmationResult) => {
        setConfirmation(confirmationResult);
      })
      .catch((error) => {
        console.error("OTP send failed:", error);
        alert("Failed to send OTP: " + error.message);
      });
  }, [phone]);

  const handleVerify = async () => {
    if (!otp || !confirmation) return alert("Please enter the OTP.");

    try {
      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();

      const res = await axios.post("http://localhost:5000/api/users/verify/user", {
        idToken,
      });

      if (res.data.verified) {
        alert("Phone verified successfully!");
        localStorage.removeItem("phone");
        navigate("/login");
      } else {
        alert("Phone verification failed.");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("Invalid OTP. Please try again.");
      localStorage.removeItem("phone");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-purple-600">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-2 border rounded mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          onClick={handleVerify}
          className="w-full bg-purple-600 text-white p-2 rounded"
        >
          Verify
        </button>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
