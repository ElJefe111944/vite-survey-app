
const ErrorMessage = ({ error }: { error: string }) => {

    return (
        <div className="h-full w-full flex absolute justify-center items-center">
        <p>{error}</p>
    </div>
    )
};

export default ErrorMessage;