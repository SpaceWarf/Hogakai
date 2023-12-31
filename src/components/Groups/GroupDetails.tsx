import "./Groups.scss";
import Header from "../Common/Header";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupInformation from "./GroupInformation";
import { Tab } from "semantic-ui-react";
import GroupMembers from "./GroupMembers";
import { useEffect, useState } from "react";
import GroupIntel from "./GroupIntel";
import { Group } from "../../state/groups";
import { DatabaseTable, getItems } from "../../utils/firestore";

function GroupDetails() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState<number>(0);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      setGroups(await getItems<Group>(DatabaseTable.GROUPS));
    }

    fetchGroups();
  }, []);

  useEffect(() => {
    if (searchParams.has('active') && !isNaN(Number(searchParams.get('active')))) {
      setActive(Number(searchParams.get('active')))
    }
  }, [searchParams]);

  const getPanes = () => (groupId === 'new' ? [
    {
      menuItem: { key: 'information', icon: 'address card', content: 'Information' },
      render: () => <GroupInformation groups={groups} />
    }
  ] : [
    {
      menuItem: { key: 'information', icon: 'address card', content: 'Information' },
      render: () => <GroupInformation groups={groups} />
    },
    {
      menuItem: { key: 'members', icon: 'users', content: 'Members' },
      render: () => <GroupMembers groups={groups} />
    },
    {
      menuItem: { key: 'intel', icon: 'picture', content: 'Intel' },
      render: () => <GroupIntel />
    },
  ]);

  const handleSetActive = (active: number) => {
    setActive(active);
    setSearchParams({ active: `${active}` });
  }

  return (
    <div className="GroupDetails">
      <Header text='Group Details' decorated />
      <div className="content">
        <div className="actions">
          <p className="hyperlink-button" onClick={() => navigate('/groups')}><i className='arrow left icon' />back</p>
        </div>
        <Tab
          menu={{ secondary: true, pointing: true }}
          panes={getPanes()}
          activeIndex={active}
          onTabChange={(_, { activeIndex }) => handleSetActive(Number(activeIndex))}
        />
      </div>
    </div>
  );
}


export default GroupDetails;