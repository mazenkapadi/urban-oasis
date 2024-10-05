import { useNavigate } from "react-router-dom";

const ProfileOrSignIn = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate("/signIn");
    };

    return (
        <div className="flex items-center space-x-4">
            {isLoggedIn ? (
                    <button
                    onClick={() => navigate("/userProfilePage")}
                        className="w-10 h-10 rounded-lg overflow-hidden">
                        <img
                            src="https://picsum.photos/32"
                            alt="User Profile"
                            className="w-full h-full object-cover"
                        />
                    </button>
            ) : (
                <button
                    className="rounded-lg bg-gray-900 text-gray-200 px-6 py-2"
                    onClick={handleSignIn}
                >
                    Sign In
                </button>
            )}
        </div>
    );
};

export default ProfileOrSignIn;