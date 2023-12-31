import "./Jobs.scss";
import Header from "../Common/Header";
import { useNavigate } from "react-router-dom";
import JobInfoCard from "./JobInfoCard";
import { useState, useEffect } from "react";
import { JobInfo } from "../../state/jobs";
import { getJobInfosForDivision } from "../../utils/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function JobPicker() {
  const navigate = useNavigate();
  const { info } = useSelector((state: RootState) => state.profile);
  const [jobs, setJobs] = useState<JobInfo[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      setJobs(await getJobInfosForDivision(info.division));
    }
    fetchJobs();
  }, [info]);

  return (
    <div className='JobPicker'>
      <div className="content">
        <div className="NewJob">
          <Header text='Create New Job' decorated />
          <div className="content">
            <div className="actions">
              <p className="hyperlink-button" onClick={() => navigate('/jobs')}><i className='arrow left icon' /> back</p>
            </div>
            <div className="JobInfoContainer">
              {[...jobs].sort((a, b) => a.order - b.order).map(info => (
                <JobInfoCard info={info} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default JobPicker;