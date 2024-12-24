import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { ChatLayout } from "./components/chat/ChatLayout";
import { useAuthStore } from "./stores/authStore";
import { Toaster } from "react-hot-toast";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginForm />} />
				<Route path="/register" element={<RegisterForm />} />
				<Route
					path="/chat"
					element={
						<PrivateRoute>
							<ChatLayout />
						</PrivateRoute>
					}
				/>
				<Route path="/" element={<Navigate to="/chat" />} />
			</Routes>
			<Toaster position="top-right" />
		</Router>
	);
}

export default App;
