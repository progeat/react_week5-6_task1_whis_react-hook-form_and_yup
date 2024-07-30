import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStore } from "./hooks";
// import { sendFormData } from "./utils";
import { EMAIL_REGEXP, PASSWORD_REGEXP } from "./constants";
import styles from "./app.module.css";

const sendFormData = (formData) => {
	// console.log("Отправка", formData);
	console.log("Отправка");
};

const fieldsSchema = yup.object().shape({
	email: yup
		.string()
		.matches(
			EMAIL_REGEXP,
			'Неверно указана почта. Почта должна содержать имя пользователя, знак "@", имя хоста, разделитель "." и название домена. Пример "username@hostname.com".',
		),
	password: yup
		.string()
		.matches(
			PASSWORD_REGEXP,
			'Неверно указан пароль. Пароль должен содержать латинские буквы вверхнем и нижнем регистре, цифры, спецсимволы "`~@!#$%&?"',
		)
		.min(8, "Неверно указан пароль. Должно быть не меньше 8 символов")
		.max(20, "Неверно указан пароль. Должно быть не больше 20 символов"),
	repeatPassword: yup
		.string()
		.oneOf(
			[yup.ref("password")],
			"Подтверждение пароля не совпадает с заданным",
		),
});

export const App = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: "",
		},
		resolver: yupResolver(fieldsSchema),
	});

	const emailError = errors.email?.message;
	const passwordError = errors.password?.message;
	const repeatPassword = errors.repeatPassword?.message;

	console.log(emailError, passwordError, repeatPassword);

	return (
		<div className={styles.app}>
			<form className={styles.form} onSubmit={handleSubmit(sendFormData)}>
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
					// ref={buttonSubmit}
					className={styles.button}
					type="submit"
					disabled={!!emailError && !!passwordError}
				>
					Зарегистрироваться
				</button>
			</form>
			{emailError && <div className={styles.error}>{emailError}</div>}
			{passwordError && (
				<div className={styles.error}>{passwordError}</div>
			)}
			{repeatPassword && (
				<div className={styles.error}>{repeatPassword}</div>
			)}
		</div>
	);
};
