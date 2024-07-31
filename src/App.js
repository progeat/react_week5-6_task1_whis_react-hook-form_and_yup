import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendFormData } from "./utils";
import { EMAIL_REGEXP, PASSWORD_REGEXP } from "./constants";
import styles from "./app.module.css";

const fieldsSchema = yup.object().shape({
	email: yup
		.string()
		.required("Введите email.")
		.matches(
			EMAIL_REGEXP,
			'Неверно указана почта. Почта должна содержать имя пользователя, знак "@", имя хоста, разделитель "." и название домена. Пример "username@hostname.com".',
		),
	password: yup
		.string()
		.required("Введите пароль.")
		.matches(
			PASSWORD_REGEXP,
			'Неверно указан пароль. Пароль должен содержать латинские буквы вверхнем и нижнем регистре, цифры, спецсимволы "`~@!#$%&?".',
		)
		.min(8, "Неверно указан пароль. Должно быть не меньше 8 символов.")
		.max(20, "Неверно указан пароль. Должно быть не больше 20 символов."),
	repeatPassword: yup
		.string()
		.oneOf(
			[yup.ref("password")],
			"Подтверждение пароля не совпадает с заданным.",
		),
});

export const App = () => {
	const buttonSubmit = useRef(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: "",
		},
		resolver: yupResolver(fieldsSchema),
	});

	const messageError = Object.values(errors)
		.map((error) => error.message)
		.join("\n");

	useEffect(() => {
		if (isValid) {
			buttonSubmit.current.focus();
		}
	}, [isValid]);

	return (
		<div className={styles.app}>
			<form
				className={styles.form}
				onSubmit={handleSubmit((data) => sendFormData(data, reset))}
			>
				<h1 className={styles.label}>
					Регистрация нового пользователя
				</h1>
				<input
					name="email"
					type="email"
					placeholder="Почта"
					{...register("email")}
				/>
				<input
					name="password"
					type="password"
					placeholder="Пароль"
					{...register("password")}
				/>
				<input
					name="repeatPassword"
					type="password"
					placeholder="Подтверждение пароля"
					{...register("repeatPassword")}
				/>
				<button
					ref={buttonSubmit}
					className={styles.button}
					type="submit"
					disabled={!isValid}
				>
					Зарегистрироваться
				</button>
			</form>
			{messageError && <div className={styles.error}>{messageError}</div>}
		</div>
	);
};
