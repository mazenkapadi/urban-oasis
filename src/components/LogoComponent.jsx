const LogoComponent = () => {
    return (
        <div className="flex items-center" >
            <button onClick={() => window.location.href = "/"} >
                <div className="flex items-center" >
                    <img
                        src="/public/oasis.png"
                        alt="Oasis Logo"
                        className="w-12 h-auto"
                    />
                    <span className="ml-2 text-white text-2xl font-archivo" >
                        Urban Oasis
                    </span >
                </div >
            </button >
        </div >
    );
};

export default LogoComponent;






