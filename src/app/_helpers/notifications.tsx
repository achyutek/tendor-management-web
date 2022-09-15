import { notification, message } from "antd";

const successMessage = (inputMessage: string) => {
    message.success(inputMessage);
};

const warningMessage = (inputMessage: string) => {
    message.warning(inputMessage);
};

const errorMessage = (inputMessage: string) => {
    message.error(inputMessage);
};

const addMessage = (context: string) => {
    successMessage(context + " has been added successfully");
};

const updateMessage = (context: string) => {
    successMessage(context + " has been updated successfully");
};

const deleteMessage = (context: string) => {
    errorMessage(context + " deleted successfully");
};
const openSuccessNotification = (inputMessage: string) => {
    notification.success({
        message: "Success",
        description: inputMessage,
        duration: 5,

    });
};

const openWarningNotification = (inputMessage: string) => {

    notification.warning({
        message: "Warning",
        description: inputMessage,
        duration: 5,

    });
};

const openErrorNotification = (inputMessage: string) => {

    notification.error({
        message: "Error",
        description: inputMessage,
        duration: 5,
    });
};

export const notifications = {
    successMessage,
    warningMessage,
    errorMessage,
    addMessage,
    updateMessage,
    deleteMessage,
    openSuccessNotification,
    openWarningNotification,
    openErrorNotification,
};
