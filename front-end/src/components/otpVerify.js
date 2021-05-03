import React, { useState } from 'react';
import styles from './styles/style.module.css';
import axios from 'axios';
const { REACT_APP_LOGIN_REGISTER_URL} = process.env;

function OtpVerify(props) {
	axios.defaults.withCredentials = true;

	const [ error, setError ] = useState({
		error: '',
		success: ''
	});
	const { value, handleChange } = props;
	const back = (e) => {
		e.preventDefault();
		props.prevStep();
	};

	const confirmOtp = () => {
		localStorage.setItem('phnNumber', `${value.phone}`)
		axios
			.post('https://139.59.38.45/user-authenticate-service/verify-otp', {
				phnNumber: `${value.phone}`,
				hash: `${value.hash}`,
				otp: `${value.otp}`,
				withCredentials: true
			})
			.then(function(res) {
				console.log(res.data);
				if(res.data.varification){
					console.log("dd");
					localStorage.setItem("accessToken", res.data.accessToken);
              		localStorage.setItem("accessTokenExp", res.data.accessTokenExp);
					localStorage.setItem("refreshToken", res.data.refreshToken);
              		localStorage.setItem("refreshTokenExp", res.data.refreshTokenExp);
					
					//localStorage.setItem("user", JSON.stringify(res.data));
					window.location.replace(REACT_APP_LOGIN_REGISTER_URL)
				}
				
				//this.props.history.push("/profile");
				//window.location.reload();
			})
			.catch(function(error) {
				console.log(error.response.data);
				setError({ ...error, error: error.response.data.msg });
			});
	};
	return (
		<div className={styles}>
			<div className={styles.background}>
				<div className={styles.container}>
					<div className={styles.heading}>Tigon Futuristics</div>
					<div className={styles.error}>{error.error}</div>
					<div className={styles.success}>{error.success}</div>
					<div className={styles.input_text}>Enter One Time Password:</div>
					<div className={styles.input_container}>
						<input
							type="tel"
							value={value.otp}
							onChange={handleChange('otp')}
							placeholder="Enter the 6 digits OTP"
							className={styles.input}
						/>
					</div>
					<button onClick={back} className={styles.back}>
						Back
					</button>
					<button onClick={confirmOtp} className={styles.submit}>
						Verify OTP
					</button>
				</div>
			</div>
		</div>
	);
}

export default OtpVerify;
