import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent.jsx";
import FooterComponent from "../components/FooterComponent.jsx";

function LandingPage() {

    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/signIn')
    }

    const images = [
        'https://via.placeholder.com/600x400?text=Slide+1',
        'https://via.placeholder.com/600x400?text=Slide+2',
        'https://via.placeholder.com/600x400?text=Slide+3',
    ];

    return (
        <>
            <HeaderComponent />
            <div className="p-8" >
                <h3 className="text-5xl text-slate-700" >Hey welcome to the landing page</h3 >
                <div className="pt-8" >
                    <hr className="" ></hr >
                    <button
                        className="box-border border-4 rounded-lg bg-gray-900 text-gray-200 px-6 py-2 flex items-center justify-center"
                        onClick={handleSignIn}
                    > Sign In
                    </button >
                </div >
            </div >
            <FooterComponent />
        </>
    )

}

export default LandingPage;
