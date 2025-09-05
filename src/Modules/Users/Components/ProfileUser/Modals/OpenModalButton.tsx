    type Props = {
    onOpen: () => void;
    label?: string;
    };

    const OpenModalButton = ({ onOpen, label }: Props) => {
    return ( 
        <button
        onClick={onOpen}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
        {label}
        </button>
    );
    };

    export default OpenModalButton;
