import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import styleConfigs from "../../config/styleConfigs";
import { getCookie, setCookie } from "../../utils/cookie";
import { UserType } from "../../models/UserType";

function SignIn() {
    const navigate = useNavigate();

    const [cName, setCName] = useState("");
    const [pw, setPW] = useState("");
    const [loading, setLoading] = useState(false); // New state for loading

    const signInAxios = async (e: any) => {
        e.preventDefault();

        const cn_reg = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
        const pw_reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
        if (!cn_reg.test(cName)) {
            alert("회사 이름을 확인해주세요.");
            return;
        }
        if (!pw_reg.test(pw)) {
            alert("비밀번호를 확인해주세요.");
            return;
        }

        // Set loading to true when starting the request
        setLoading(true);

        fetch(process.env.REACT_APP_DB_HOST+'/users/signin', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyName: cName,
                password: pw
            })
        })
            .then((response) => response.json())
            .then((data) => {
                const user: UserType = data;
                localStorage.setItem('token', data.access_token);
                setCookie("user_id", user.id.toString());
                setCookie("security_policy_id", user.security_policy_id.toString());
                setCookie("wf_app_id", user.app_id.toString());
                setCookie("app_name", user.app_name.toString());
                if(user.level === 1) {
                    navigate("/customers/dashboard");
                } else if(user.level === 2) {
                    navigate("/pi5neer/dashboard");
                }
                           
            })
            .catch((error) => {
                if (error) {
                    alert("회사 이름과 비밀번호를 다시 확인해주세요")
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: "50%", margin: "auto", padding: "80px", maxWidth: "500px" }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{}}>
                <Typography variant="h4" paddingBottom="16px" fontWeight="700">4조</Typography>
                
                    <Button
                        onClick={(e) => { navigate('/users/signup'); }}
                        sx={{
                            marginTop: "4px",

                            height: "42px",
                            borderRadius: "8px",
                            background: "#FFFFFF",
                            color: "#18A0FB",
                            border: "1px solid #18A0FB"
                        }}>Go To Sign Up
                    </Button>
                </Box>
                <br></br>
                <Typography>더 빠르고 안정적이며 안전한 서비스로 고객의 비즈니스 가치를 극대화시킵니다</Typography>
            </Box>

            <Box sx={{ width: "50%", margin: "auto", padding: "50px", minWidth: "460px", maxWidth: "580px" }}>
                <Box sx={{ padding: "30px", background: "white", boxShadow: styleConfigs.boxShadow, borderRadius: "30px" }}>
                    <Box sx={{ paddingTop: "20px", paddingBottom: "50px" }}>
                        <Typography variant="h4" paddingBottom="16px" fontWeight="700">Sign In</Typography>

                        <TextField
                            fullWidth
                            size='small'
                            placeholder="Input Company Name"
                            sx={{ height: "42px", padding: "4px" }}
                            onChange={(e) => setCName(e.target.value)} />
                        <TextField
                            fullWidth
                            size='small'
                            placeholder="Input Password"
                            sx={{ height: "42px", padding: "4px" }}
                            type="password"
                            onChange={(e) => setPW(e.target.value)} />

                        <Button
                            onClick={signInAxios}
                            sx={{
                                marginTop: "4px",
                                width: "100%",
                                height: "42px",
                                borderRadius: "8px",
                                background: "#18A0FB",
                                color: "white",
                                border: "1px solid #18A0FB"
                            }}
                            disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Login"}
                        </Button>


                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default SignIn;
