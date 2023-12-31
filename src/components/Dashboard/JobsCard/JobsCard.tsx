import './JobsCard.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../../state/jobs';
import JobListing from './JobListing';
import { getActiveJobs } from '../../../redux/selectors/jobs';

function JobsCard() {
  const navigate = useNavigate();
  const jobs = useSelector(getActiveJobs);
  const profileInfo = useSelector((state: RootState) => state.profile.info);

  const getCrew = (job: Job): string[] => {
    return Object.keys(job.crew).reduce((crew: string[], role) => {
      return [...crew, ...job.crew[role]]
    }, [])
  }

  const getMyJobs = (): Job[] => {
    return jobs.filter(job => getCrew(job).includes(profileInfo.id));
  }

  const getOtherJobs = (): Job[] => {
    return jobs.filter(job => !getCrew(job).includes(profileInfo.id));
  }

  return (
    <div className="JobsCard ui card attached external">
      <div className="content">
        <div className='header'>
          <p><i className='dollar alternate icon' /> Active Jobs</p>
          <button className="ui icon button" onClick={() => navigate('/jobs')}>
            <i className='external alternate icon' />
          </button>
        </div>
        <div className='JobsContainer'>
          {jobs.length === 0 && (
            <p className='NoJobsLabel'>No active jobs...</p>
          )}
          {getMyJobs().map(job => (
            <JobListing job={job} myJob />
          ))}
          {getOtherJobs().map(job => (
            <JobListing job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobsCard;
