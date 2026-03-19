import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User } from 'lucide-react';

export function ConsultationRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const localVideoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        let activeStream = null;

        // Request camera and microphone
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(mediaStream => {
                activeStream = mediaStream;
                setStream(mediaStream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = mediaStream;
                }
            })
            .catch(err => {
                console.error("Failed to get local stream", err);
                alert("Impossible d'accéder à la caméra ou au microphone.");
            });

        return () => {
            // Cleanup on unmount
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = isVideoOff;
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        navigate('/dashboard');
    };

    const remoteRole = user?.type === 'psychologist' ? 'patient' : 'psychologue';

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col pt-16">
            {/* Header */}
            <div className="bg-slate-800/80 backdrop-blur-md p-4 text-white flex flex-col sm:flex-row justify-between items-center gap-2 z-10 border-b border-slate-700">
                <div className="font-semibold truncate max-w-xs">{roomId ? `Salle: ${roomId}` : 'Consultation'}</div>
                <div className="text-xs sm:text-sm bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Connexion chiffrée de bout en bout
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative p-4 flex flex-col md:flex-row gap-4 items-center justify-center overflow-hidden">

                {/* Remote Video (Simulated) */}
                <div className="w-full md:w-3/4 lg:w-4/5 h-[50vh] md:h-full bg-slate-800 rounded-3xl overflow-hidden relative flex items-center justify-center border border-slate-700 shadow-2xl">
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600 shadow-inner">
                            <User className="w-12 h-12 text-slate-500" />
                        </div>
                        <p className="text-slate-400 font-medium tracking-wide">En attente du {remoteRole}...</p>
                    </div>
                </div>

                {/* Local Video */}
                <div className="w-32 h-48 sm:w-48 sm:h-64 md:w-64 md:h-80 bg-slate-800 rounded-2xl overflow-hidden relative border-2 border-slate-600 shadow-xl self-end md:self-auto md:absolute md:bottom-8 md:right-8 z-20 transition-all">
                    {isVideoOff ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <User className="w-12 h-12 text-slate-600" />
                        </div>
                    ) : (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white font-medium">
                        Vous{isMuted ? ' (Muet)' : ''}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-900 p-6 flex justify-center gap-4 sm:gap-6 pb-8 md:pb-12 border-t border-slate-800">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full transition-all shadow-lg flex items-center justify-center ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                    title={isMuted ? "Activer le micro" : "Couper le micro"}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button
                    onClick={endCall}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg flex items-center justify-center shadow-red-500/20 px-8 gap-2 font-bold hover:scale-105 active:scale-95"
                    title="Quitter la consultation"
                >
                    <PhoneOff className="w-6 h-6" />
                    <span className="hidden sm:inline">Quitter</span>
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full transition-all shadow-lg flex items-center justify-center ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                    title={isVideoOff ? "Activer la caméra" : "Désactiver la caméra"}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>
            </div>
        </div>
    );
}
