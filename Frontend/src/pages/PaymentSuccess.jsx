import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const userId = params.get("userId");
  const [status, setStatus] = useState("processing"); 
  // "processing" | "success" | "error"

  useEffect(() => {
    if (userId) {
      axios.post("http://localhost:5000/api/mark-premium", { userId })
        .then(res => {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setStatus("success");
        })
        .catch(err => {
          console.error("Premium upgrade failed:", err);
          setStatus("error");
        });
    } else {
      setStatus("error");
    }
  }, [userId]);

  const handleOkay = () => {
    navigate("/");
  };

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen text-center text-white">
      {status === "processing" && (
        <p className="text-gray-300">⏳ Processing your payment...</p>
      )}
      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold text-green-500">✅ Payment Successful!</h1>
          <p className="mt-4 text-lg">
            🎉 Congrats! You are now a{" "}
            <span className="font-semibold text-yellow-400">Premium Member</span>.
          </p>
          <button
            onClick={handleOkay}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:opacity-90 transition"
          >
            Okay
          </button>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-bold text-red-500">❌ Something went wrong</h1>
          <p className="mt-4">We couldn’t verify your payment. Please try again.</p>
          <button
            onClick={handleOkay}
            className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
          >
            Back to Home
          </button>
        </>
      )}
    </div>
  );
}
