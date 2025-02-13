import AddCompetence from '../components/AddCompetence';
import UserCompetences from '../components/UserCompetences';
import { useUser } from '../context/UserContext';
import { Box } from '@mui/material';

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
