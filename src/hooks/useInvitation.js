import {useDispatch, useSelector} from "react-redux";
import {addSentInvitation, setError} from "@/store/slices/invitationSlice.js";
import {setLoading} from "@/store/slices/eventSlice.js";
import {sendInvitationToOneUserAPI} from "@/services/InvitationService.js";
import {checkToken} from "@/helpers/checkToken.js";
import {Toast} from "@/helpers/toastService.js";
export const useInvitation = () => {

    const dispatch = useDispatch();
    const loading = useSelector((state) => state.invitation.loading);
    const error = useSelector((state) => state.invitation.error);

    const sendInvitationToOneUser = async (invitationData) => {

        try{
            dispatch(setError(null));
            dispatch(setLoading(true));
            checkToken();
            // Call API to send invitation
            const response = await sendInvitationToOneUserAPI(invitationData);

            if (!response.success) {
                throw new Error('Failed to send invitation');
            }
            // dispatch(addSentInvitation(response.content.invitation));
            return response;
        }
        catch (error) {
            dispatch(setError(error.message));
            // console.log(error);
            Toast.error('Failed to sent invitation: ' + error.response.data.message);
            throw error;
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    return {
        sendInvitationToOneUser
    }
}

export default useInvitation;