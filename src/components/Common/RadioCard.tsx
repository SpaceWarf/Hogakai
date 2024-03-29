import { Radio } from "../../state/radio";
import RadioChannel from "./RadioChannel";
import { getJobById } from "../../redux/selectors/jobs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { capitalize } from "../../utils/string";

interface RadioCardProps {
  radio: Radio;
}

function RadioCard(props: RadioCardProps) {
  const job = useSelector((state: RootState) => getJobById(state, props.radio.job));

  const getTitle = () => {
    if (job) {
      return `${job.name} ${job.index} Radio`;
    }

    return `${capitalize(props.radio.type)} Radio`
  }

  return (
    <div className={`RadioCard ui card external ${props.radio.burned ? "burned" : ""}`}>
      <div className="content">
        <div className="header">
          <p>
            <i className={props.radio.burned ? "fire icon" : "microphone icon"} />
            {getTitle()}
          </p>
        </div>
        <div className="Labels">
          <RadioChannel radio={props.radio} job={job} />
          {props.radio.burned && <p className="BurnedLabel"><b>BURNED</b></p>}
        </div>
      </div>
    </div>
  );
}

export default RadioCard;