import { createRadio, getWebhookById, updateRadio } from "../../utils/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Radio } from "../../state/radio";
import { generateRadioChannel } from "../../utils/radio";
import profile from "../../redux/reducers/profile";
import { Webhook } from "../../state/webhook";
import { Job } from "../../state/jobs";
import { triggerDiscordWebhook } from "../../services/functions";

interface RadioChannelProps {
  radio: Radio;
  job?: Job
}

function RadioChannel(props: RadioChannelProps) {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [webhook, setWebhook] = useState<Webhook>();

  useEffect(() => {
    const fetchWebhook = async () => {
      setWebhook(await getWebhookById('radio-update'));
    }

    fetchWebhook();
  }, [isAdmin, profile]);

  const sendWebhook = (newChannel?: string) => {
    if (webhook) {
      triggerDiscordWebhook({
        url: webhook.url,
        content: getWebhookString(newChannel),
      }).catch(error => {
        console.error(error);
      });
    }
  }

  const getWebhookString = (newChannel?: string) => {
    if (props.radio.main) {
      return `@here burn main ~~${props.radio.channel}~~!\nNEW MAIN - ${newChannel}`;
    }

    if (props.job) {
      return `@here burn ${props.job.name} ${props.job.index} radio ~~${props.radio.channel}~~`;
    }

    return `@here burn radio ~~${props.radio.channel}~~`
  }

  const handleRerollChannel = async () => {
    if (props.radio) {
      setLoading(true);
      await updateRadio(props.radio.id, {
        ...props.radio,
        channel: generateRadioChannel([]),
      }, user);
      setLoading(false);
    }
  }

  const handleBurnChannel = async () => {
    if (props.radio) {
      setLoading(true);

      if (props.radio.main) {
        const newMain = generateRadioChannel([])
        sendWebhook(newMain);
        await createRadio({
          channel: newMain,
          main: false,
          burned: false,
          job: props.job?.id ?? "",
        }, user);
      } else {
        sendWebhook();
      }

      await updateRadio(props.radio.id, {
        ...props.radio,
        burned: true,
        burnTime: new Date().toISOString(),
      }, user);
      setLoading(false);
    }
  }

  return (
    <div className='RadioChannel'>
      <p className="ChannelLabel">{props.radio.channel}</p>
      {!props.radio.burned && (
        <div>
          <button className="ui icon button" disabled={loading} onClick={() => handleRerollChannel()}>
            <i className="refresh icon" />
          </button>
          <button className="ui icon negative button" disabled={loading} onClick={() => handleBurnChannel()}>
            <i className="fire icon" />
          </button>
        </div>
      )}
    </div>
  );
}

export default RadioChannel;