import './RadiosCard.scss';
import { useSelector } from 'react-redux';
import { getActiveRadios, getFriendsRadio, getMainRadio, getSlideRadio } from '../../../redux/selectors/radios';
import { useNavigate } from 'react-router-dom';
import RadioChannel from '../../Common/RadioChannel';
import { Radio } from '../../../state/radio';
import { getActiveJobs } from '../../../redux/selectors/jobs';
import { capitalize } from '../../../utils/string';

function RadiosCard() {
  const navigate = useNavigate();
  const mainRadio = useSelector(getMainRadio);
  const slideRadio = useSelector(getSlideRadio);
  const friendsRadio = useSelector(getFriendsRadio);
  const activeRadios = useSelector(getActiveRadios);
  const activeJobs = useSelector(getActiveJobs);

  const getRadioName = (radio: Radio): string => {
    if (radio.job) {
      const job = activeJobs.find(active => active.id === radio.job);

      if (job) {
        return `${job.name} ${job.index}`;
      }
    }

    return `${capitalize(radio.type)} Radio`
  }

  return (
    <div className="RadiosCard ui card attached external">
      <div className="content">
        <div className='header'>
          <p><i className='microphone alternate icon' /> Radios</p>
          <button className="ui icon button" onClick={() => navigate('/radios')}>
            <i className='external alternate icon' />
          </button>
        </div>
        <div className='Listing MainListing'>
          {mainRadio && (
            <div>
              <RadioChannel radio={mainRadio} />
              <p className='RadioLabel'>{getRadioName(mainRadio)}</p>
            </div>
          )}
          {friendsRadio && (
            <div>
              <RadioChannel radio={friendsRadio} />
              <p className='RadioLabel'>{getRadioName(friendsRadio)}</p>
            </div>
          )}
          {slideRadio && (
            <div>
              <RadioChannel radio={slideRadio} />
              <p className='RadioLabel'>{getRadioName(slideRadio)}</p>
            </div>
          )}
        </div>
        {activeRadios.length > 0 && (
          <div className='Listing ActiveListing'>
            {activeRadios.map(radio => (
              <div>
                <RadioChannel radio={radio} />
                <p className='RadioLabel'>{getRadioName(radio)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RadiosCard;
