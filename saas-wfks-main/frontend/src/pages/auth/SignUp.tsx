import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import styleConfigs from '../../config/styleConfigs';


function SignUp() {
    const navigate = useNavigate();

    const [cName, setCName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPW] = useState('');
    const [pwCheck, setPwCheck] = useState('');
    const [doAddr, setDoAddr] = useState('');
    const [ipAddr, setIpAddr] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpAxios(e: any) {
        e.preventDefault();

        const cn_reg = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
        const email_reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const pw_reg = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/;
        const do_reg = /^(http:\/\/|https:\/\/)?([0-9a-zA-Z-]+\.)+[a-zA-Z]+(\/\S*)?/;
        const ip_reg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        if (!cn_reg.test(cName)) {
            alert("회사 이름을 확인해주세요.");
            return false;
        }
        if (!email_reg.test(email)) {
            alert("이메일 확인해주세요.");
            return false;
        }
        if (!pw_reg.test(pw) ) {
            alert("비밀번호는 영문 숫자 특수기호 조합 8자리 이상입니다.");
            return false;
        }
        if( pw !== pwCheck) {
            alert("비밀번호가 같지 않습니다.");
            return false;
        }
        if (!do_reg.test(doAddr)) {
            alert("도메인 주소를 확인해주세요");
            return false;
        }
        if (!ip_reg.test(ipAddr)) {
            alert("IP 주소를 확인해주세요");
        }

        setLoading(true);

        try {
            const response = await fetch(process.env.REACT_APP_DB_HOST+'/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyName: cName,
                    email: email,
                    password: pw,
                    domain_address: doAddr,
                    IP_address: ipAddr,
                    membership: 'basic',
                }),
            });

            if (response.status === 201) {
                alert('회원가입 되셨습니다. 로그인 해 주세요');
                navigate('/users/signin');
            }
        } catch (err) {
            console.error('Error during signup:', err);

            if (err instanceof Response && err.status === 400) {
                alert('기존에 가입된 회사이름, 도메인 또는 이메일이 존재합니다.');
            } else {
                alert('에러가 발생했습니다. 관리자에게 문의해주세요\n');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }} >
            <Box sx={{
                width: "50%",
                margin: "auto",
                padding: "80px",
                minWidth : "500px",
                marginLeft : "40px"
            }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{maxWidth:"500px"}}>
                <Typography variant="h4" paddingBottom="16px" fontWeight="700">4조</Typography>
                    <Button
                        onClick={(e) => { navigate('/users/signin'); }}
                        sx={{
                            marginTop: "4px",
                            height: "42px",
                            borderRadius: "8px",
                            background: "#FFFFFF",
                            color: "#18A0FB",
                            border: "1px solid #18A0FB"
                        }}>Go To Sign In
                    </Button>
                </Box>
                <br></br>
                <Typography>더 빠르고 안정적이며 안전한 서비스로 고객의 비즈니스 가치를 극대화시킵니다</Typography>
            </Box>

            <Box sx={{ width: "50%", margin: "auto", padding: "80px", minWidth: "460px", maxWidth:"580px"  }}>
                <Box sx={{ boxShadow: styleConfigs.boxShadow, padding: "30px", borderRadius: "30px" }}>
                    <Box sx={{ paddingTop: "30px", paddingBottom: "60px" }}>
                        <Typography variant="h4" paddingBottom="16px" fontWeight="700">Sign Up</Typography>
                        <form onSubmit={signUpAxios}>
                            {loading ?
                                <Box sx={{ height: "350px", display: 'flex', textAlign: "center", alignItems:"center",  justifyContent: 'center', }}>
                                    <Typography>보안 기능을 활성화 하는 중입니다! <br/> 최대 1분이 소요될 수 있습니다.</Typography>
                                </Box>
                                :
                                <Box style={{ height: "350px" }}>
                                    <TextField
                                        fullWidth
                                        size='small'
                                        sx={{ height: "42px", paddingY: "8px" }}
                                        onChange={(e) => setCName(e.target.value)}
                                        placeholder="Input Company Name"
                                    />
                                    <TextField
                                        fullWidth
                                        size='small'
                                        sx={{ height: "42px", paddingY: "8px" }}
                                        onChange={(e) => setEmail(e.target.value)}
                                        id="email"
                                        placeholder="Email address"
                                    />
                                    <TextField
                                        fullWidth
                                        size='small'
                                        sx={{ height: "42px", paddingY: "8px" }}
                                        onChange={(e) => setPW(e.target.value)}
                                        id="pw"
                                        placeholder="Input Password"
                                        type="password"
                                    />
                                    <TextField
                                        fullWidth
                                        size='small'
                                        sx={{ height: "42px", paddingY: "8px" }}
                                        onChange={(e) => setPwCheck(e.target.value)}
                                        id="pw"
                                        placeholder="Confirm Password "
                                        type="password"
                                    />
                                    <TextField
                                        fullWidth
                                        size='small'
                                        sx={{ height: "42px", paddingY: "8px" }}
                                        onChange={(e) => setDoAddr(e.target.value)}
                                        id="doAddr"
                                        placeholder="Domain address ex)http://www.pi5neer.com"
                                    />
                                    <TextField
                                        fullWidth
                                        size='small'
                                        sx={{ height: "42px", paddingY: "8px" }}
                                        onChange={(e) => setIpAddr(e.target.value)}
                                        id="ipAddr"
                                        placeholder="IP address ex)0.0.0.0"
                                    />
                                </Box>}
                            <Button
                                onClick={signUpAxios}
                                disabled={loading}
                                sx={{
                                    marginTop: "4px",
                                    width: "100%",
                                    height: "42px",
                                    borderRadius: "8px",
                                    background: loading ? "#FFFFFF" : "#18A0FB",
                                    color: loading ? "#18A0FB" : "#FFFFFF",
                                    border: "1px solid #18A0FB"
                                }}> {loading ? <CircularProgress size={24} /> : "Sign Up"}
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default SignUp;
