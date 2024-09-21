const MenuButton = ({ toggleMenu }) => {
    return (
        <button onClick={toggleMenu} className="focus:outline-none relative">
            <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                />
            </svg>
        </button>
    );
};

export default MenuButton;
