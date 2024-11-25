const LogoComponent = () => {
    return (
        <div className="flex items-center" >
            <button onClick={() => window.location.href = "/"} >
                <div className="flex items-center" >
                    <img
                        src="/public/assets/Logos/SVG/Wordmark/Wordmark_Darkmode.svg"
                        alt="Oasis Logo"
                        className="w-12 h-auto"
                    />
                </div >
            </button >
        </div >
    );
};

export default LogoComponent;






