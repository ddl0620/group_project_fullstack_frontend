export const useMessage = () => {
    const showMessage = (message, type) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    };

    return { showMessage };
}