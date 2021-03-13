import React from 'react';
import styles from './styles/style.module.css';
import axios from 'axios';
function PhoneInput(props) {
	const { value, handleChange, hashHandleChange } = props;

	const Continue = (e) => {
		axios
			.post('/user-authenticate-service/send-otp', {
				phnNumber: `${value.phone}`
			})
			.then(function(res) {
				console.log(res.data.otp);
				const hash = res.data.hash;
				hashHandleChange(hash);
			});

		e.preventDefault();
		props.nextStep();
	};
	return (
		<div className={styles}>
			<div className={styles.background}>
				<div className={styles.container}>
					<div className={styles.heading}>Tigon Futuristics</div>
					
					<div className={styles.input_text}>Phone Number:</div>
					<div className={styles.input_container}>
						<input
							type="tel"
							value={value.phone}
							onChange={handleChange('phone')}
							placeholder="Enter the Phone No."
							className={styles.input}
						/>
					</div>
					<button onClick={Continue} className={styles.submit}>
						Send OTP
					</button>
				</div>
			</div>
		</div>
	);
}

export default PhoneInput;
