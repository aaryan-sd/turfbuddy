import { useEffect, useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import axios from "axios";

export default function OTPVerify() {
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const phone = localStorage.getItem("phone");

  useEffect(() => {
    if (!phone) {
      alert("No phone number found.");
      return;
    }

    const initializeRecaptcha = () => {
      if (!window.recaptchaVerifier && document.getElementById("recaptcha-container")) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              // reCAPTCHA solved
            },
            "expired-callback": () => {
              alert("reCAPTCHA expired. Please try again.");
            },
          },
          auth
        );

        // Send OTP
        signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier)
          .then((confirmationResult) => {
            setConfirmation(confirmationResult);
          })
          .catch((err) => {
            console.error("signInWithPhoneNumber Error", err);
            alert("Failed to send OTP: " + err.message);
          });
      }
    };

    // Delay to ensure DOM is ready
    setTimeout(initializeRecaptcha, 500);
  }, [phone]);

  const handleVerify = async () => {
    if (!otp || !confirmation) return alert("Please enter OTP.");
    try {
      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();

      const res = await axios.post("http://localhost:5000/api/users/verify/user", {
        idToken,
      });

      if (res.data.verified) {
        alert("Phone verified!");
        // Redirect or update state as needed
      } else {
        alert("Verification failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid OTP or verification failed.");
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
        {/* This must exist in DOM for reCAPTCHA to mount */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
