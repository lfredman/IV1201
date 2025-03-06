import AddCompetence from '../components/AddCompetence';
import UserCompetences from '../components/UserCompetences';
import { useUser } from '../context/UserContext';
import { Box } from '@mui/material';

/**
 * `EditProfile` Component
 * 
 * This component is used for displaying the user's profile editing interface. It checks if the user is logged in by accessing
 * the user context. If the user is logged in, it renders a section where they can view and edit their competences, 
 * as well as add new competences to their profile.
 * 
 * The component includes:
 * - A `UserCompetences` component that displays the current competences and allows editing (if the `editable` prop is true).
 * - An `AddCompetence` component that enables the user to add new competences to their profile.
 * 
 * If the user is not logged in, a message is displayed prompting them to log in to access these features.
 * 
 * @returns {JSX.Element} The rendered JSX element:
 * - Displays a profile editing interface if the user is logged in, with components for viewing/editing competences and adding new ones.
 * - Displays a message prompting the user to log in if they are not logged in.
 */
const EditProfile: React.FC = () => {
    const { user } = useUser();

    return (
      <div>
        {user ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ marginRight: 1 }}> 
                        <UserCompetences editable={true} />
                </Box>
                <Box>
                    <AddCompetence />
                </Box>
            </Box>
        ) : (
          <p>Please log in to access more features.</p>
        )}
      </div>
    );
};

export default EditProfile;
