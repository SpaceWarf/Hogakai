import "./Jobs.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Job } from "../../state/jobs";
import { getRadioForJob } from "../../redux/selectors/radios";
import { createRadio } from "../../utils/firestore";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import RadioChannel from "../Common/RadioChannel";
import { generateRadioChannel } from "../../utils/radio";

interface JobRadioProps {
  job: Job;
}

function JobRadio(props: JobRadioProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const radio = useSelector((state: RootState) => getRadioForJob(state, props.job.id));

  const handleCreateRadio = async () => {
    setLoading(true);
    await createRadio({
      channel: generateRadioChannel([]),
      main: false,
      burned: false,
      job: props.job.id,
    }, user);
    setLoading(false);
  }

  return (
    <div className='JobRadio'>
      <div className='header'>
        <p><i className='microphone icon' /> Radio</p>
      </div>
      {radio ? (
        <div className="content">
          <RadioChannel radio={radio} job={props.job} />
        </div>
      ) : (
        <div className="content">
          <button
            className="ui button positive hover-animation"
            onClick={handleCreateRadio}
            disabled={loading}
          >
            <p className='label contrast'>Create Radio</p>
            <p className='IconContainer contrast'><i className='microphone icon'></i></p>
          </button>
        </div>
      )}
    </div>
  );
}

export default JobRadio;