import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
// Google Client ID from environment variables
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLogin({ onLoginSuccess, onLogout }) {
    const [user, setUser] = useState(null);
    const [imgError, setImgError] = useState(false);
    const [sdkReady, setSdkReady] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [scanLine, setScanLine] = useState(0);

    useEffect(() => {
        const saved = Cookies.get("ns_google_user");
        if (saved) {
            try {
                const u = JSON.parse(saved);
                setUser(u);
                onLoginSuccess?.(u);
            } catch (e) {
                console.error("Failed to parse cookie data", e);
            }
        }
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true; script.defer = true;
        script.onload = () => setSdkReady(true);
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    useEffect(() => {
        const handler = () => setShowModal(true);
        window.addEventListener('ns-open-login', handler);
        return () => window.removeEventListener('ns-open-login', handler);
    }, []);

    useEffect(() => {
        if (!sdkReady || user || !showModal) return;
        setTimeout(() => {
            const el = document.getElementById("ns-google-btn");
            if (!el || !window.google) return;
            window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredentialResponse });
            window.google.accounts.id.renderButton(el, { theme: "filled_black", size: "large", width: 300 });
        }, 150);
    }, [sdkReady, showModal, user]);

    useEffect(() => {
        const interval = setInterval(() => setScanLine(p => (p + 1) % 100), 30);
        return () => clearInterval(interval);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [showModal]);

    function handleCredentialResponse(response) {
        const payload = JSON.parse(atob(response.credential.split(".")[1]));
        const userData = { name: payload.name, email: payload.email, picture: payload.picture };
        setUser(userData);
        setImgError(false);
        Cookies.set("ns_google_user", JSON.stringify(userData), { expires: 7 });
        Cookies.set("ns_google_credential", response.credential, { expires: 7 });
        setShowModal(false);
        onLoginSuccess?.(userData);
    }

    function logout() {
        Cookies.remove("ns_google_user");
        Cookies.remove("ns_google_credential");
        setUser(null);
        setImgError(false);
        setShowDropdown(false);
        window.google?.accounts?.id?.disableAutoSelect();
        onLogout?.();
    }

    const teal = "#00ffb4";

    // ── Modal rendered via portal → always on top of everything ──
    const modal = showModal ? createPortal(
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 99999,
                background: "rgba(0,0,0,0.82)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px", boxSizing: "border-box", overflowY: "auto",
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
            <div style={{
                width: "100%", maxWidth: 420,
                background: "#0a0f1a", border: "1px solid rgba(0,255,180,0.35)",
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 0 80px rgba(0,255,180,0.12), 0 30px 60px rgba(0,0,0,0.8)",
                position: "relative", flexShrink: 0,
            }}>

                {/* scan line */}
                <div style={{
                    position: "absolute", left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg,transparent,rgba(0,255,180,0.6),transparent)",
                    top: scanLine + "%", pointerEvents: "none", zIndex: 1
                }} />

                {/* Header */}
                <div style={{ padding: "14px 20px", background: "rgba(0,255,180,0.05)", borderBottom: "1px solid rgba(0,255,180,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: teal, boxShadow: "0 0 8px #00ffb4", animation: "pulse 2s infinite" }} />
                        <span style={{ fontSize: 11, fontFamily: "Courier New, monospace", color: teal, fontWeight: 700, letterSpacing: "0.1em" }}>
                            NEURO-SENTRY // AUTH MODULE
                        </span>
                    </div>
                    <button
                        onClick={() => setShowModal(false)}
                        style={{
                            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13,
                            width: 26, height: 26, borderRadius: 6,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,80,80,0.15)"; e.currentTarget.style.color = "#ff5050"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "32px 36px 36px" }}>
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 64, height: 64, borderRadius: "50%", background: "rgba(0,255,180,0.08)",
                            border: "2px solid rgba(0,255,180,0.3)", fontSize: 28, marginBottom: 16,
                            boxShadow: "0 0 24px rgba(0,255,180,0.15)"
                        }}>🛡️</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "#e2f8f0", fontFamily: "Courier New, monospace", letterSpacing: "0.05em", marginBottom: 6 }}>
                            IDENTITY VERIFICATION
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                            Authenticate via Google to access<br />Neuro-Sentry command interface
                        </div>
                    </div>

                    <div style={{
                        background: "rgba(0,255,180,0.04)", border: "1px solid rgba(0,255,180,0.15)",
                        borderRadius: 8, padding: "10px 14px", marginBottom: 24, fontSize: 11,
                        fontFamily: "monospace", color: "rgba(0,255,180,0.7)", lineHeight: 1.7
                    }}>
                        <span style={{ color: teal }}>&#x25B6;</span> OAuth 2.0 secure channel active<br />
                        <span style={{ color: teal }}>&#x25B6;</span> End-to-end encryption enabled<br />
                        <span style={{ color: teal }}>&#x25B6;</span> Session token lifetime: 24h
                    </div>

                    <div id="ns-google-btn" style={{ marginBottom: 12, display: "flex", justifyContent: "center" }} />

                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 20, textAlign: "center", lineHeight: 1.6, fontFamily: "monospace" }}>
                        AUTHENTICATION REQUIRED FOR FULL SYSTEM ACCESS<br />
                        SESSION DATA IS ENCRYPTED AND NOT SHARED
                    </p>
                </div>
            </div>

            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>,
        document.body   // ← rendered directly into <body>, escaping all stacking contexts
    ) : null;

    return (
        <>
            <div style={{ position: "relative" }}>
                {!user ? (
                    <button onClick={() => setShowModal(true)}
                        style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "7px 14px",
                            background: "transparent", border: "1px solid rgba(0,255,180,0.4)", borderRadius: 6,
                            color: teal, fontSize: 12, fontFamily: "Courier New, monospace",
                            fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", textTransform: "uppercase",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,180,0.08)"; e.currentTarget.style.borderColor = teal; e.currentTarget.style.boxShadow = "0 0 12px rgba(0,255,180,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(0,255,180,0.4)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                        <span style={{ fontSize: 14 }}>&#x2B21;</span> LOGIN
                    </button>
                ) : (
                    <button onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 6px",
                            background: "rgba(0,255,180,0.06)", border: "1px solid rgba(0,255,180,0.5)",
                            borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,180,0.12)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,255,180,0.06)"}
                    >
                        {user.picture && !imgError
                            ? <img src={user.picture} alt="" referrerPolicy="no-referrer" onError={() => setImgError(true)} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #00ffb4", objectFit: "cover" }} />
                            : <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#00ffb4,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#0a0f1a" }}>{(user.name || 'U').charAt(0).toUpperCase()}</div>
                        }
                        <div>
                            <div style={{ fontSize: 11, fontFamily: "Courier New, monospace", color: teal, fontWeight: 700, lineHeight: 1.2 }}>{(user.name || 'USER').split(" ")[0].toUpperCase()}</div>
                            <div style={{ fontSize: 9, color: "rgba(0,255,180,0.5)" }}>AUTHORIZED</div>
                        </div>
                        <span style={{ color: "rgba(0,255,180,0.5)", fontSize: 10 }}>▾</span>
                    </button>
                )}

                {showDropdown && user && (
                    <div style={{
                        position: "absolute", top: "calc(100% + 8px)", right: 0, width: 240,
                        background: "#0a0f1a", border: "1px solid rgba(0,255,180,0.3)", borderRadius: 8,
                        overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 1000
                    }}>
                        <div style={{ padding: "14px 16px", background: "rgba(0,255,180,0.05)", borderBottom: "1px solid rgba(0,255,180,0.15)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {user.picture && !imgError
                                    ? <img src={user.picture} alt="" referrerPolicy="no-referrer" onError={() => setImgError(true)} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #00ffb4", objectFit: "cover" }} />
                                    : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#00ffb4,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#0a0f1a" }}>{(user.name || 'U').charAt(0).toUpperCase()}</div>
                                }
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e2f8f0", fontFamily: "Courier New, monospace" }}>{user.name}</div>
                                    <div style={{ fontSize: 10, color: "rgba(0,255,180,0.6)" }}>{user.email}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", textTransform: "uppercase" }}>Access Level</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: teal, background: "rgba(0,255,180,0.1)", padding: "2px 8px", borderRadius: 4, fontFamily: "monospace" }}>OPERATOR</span>
                        </div>
                        <button onClick={logout}
                            style={{
                                width: "100%", padding: "11px 16px", background: "transparent", border: "none",
                                display: "flex", alignItems: "center", gap: 8, color: "rgba(255,80,80,0.8)",
                                fontSize: 12, fontFamily: "Courier New, monospace", cursor: "pointer", transition: "background 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,80,80,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            &#x23FB; TERMINATE SESSION
                        </button>
                    </div>
                )}
            </div>

            {showDropdown && <div style={{ position: "fixed", inset: 0, zIndex: 999 }} onClick={() => setShowDropdown(false)} />}

            {/* Modal rendered into document.body via portal — escapes all z-index stacking contexts */}
            {modal}
        </>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}
