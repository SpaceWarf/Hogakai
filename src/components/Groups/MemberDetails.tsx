import "./Groups.scss";
import Header from "../Common/Header";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tab } from "semantic-ui-react";
import { useState, useEffect } from "react";
import MemberInformation from "./MemberInformation";
import MemberIntel from "./MemberIntel";
import { Group } from "../../state/groups";
import { getItems, DatabaseTable } from "../../utils/firestore";

function MemberDetails() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState<number>(0);
  const [groupId, setGroupId] = useState<string | null>();
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

    if (searchParams.has('group')) {
      setGroupId(searchParams.get('group'))
    }
  }, [searchParams]);

  const getPanes = () => (memberId === 'new' ? [
    {
      menuItem: { key: 'information', icon: 'address card', content: 'Information' },
      render: () => <MemberInformation groups={groups} />
    },
  ] : [
    {
      menuItem: { key: 'information', icon: 'address card', content: 'Information' },
      render: () => <MemberInformation groups={groups} />
    },
    {
      menuItem: { key: 'intel', icon: 'picture', content: 'Intel' },
      render: () => <MemberIntel />
    },
  ]);

  const handleSetActive = (active: number) => {
    setActive(active);
    setSearchParams({ active: `${active}` });
  }

  return (
    <div className="MemberDetails">
      <Header text='Member Details' decorated />
      <div className="content">
        <div className="actions">
          <p
            className="hyperlink-button"
            onClick={() => navigate(groupId ? `/groups/${groupId}?active=1` : '/members')}
          ><i className='arrow left icon' />back</p>
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


export default MemberDetails;