import ProfilePlaceholder from '../../assets/images/profile-placeholder.png';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { setPfpUrl } from '../../redux/reducers/profile';
import { DatabaseTable, updateItem } from '../../utils/firestore';
import Header from './Header';
import Input from './Input';
import { deleteProfilePicture, getProfilePictureUrl, uploadProfilePicture } from '../../utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { isEqual } from 'lodash';
import Dropdown, { DropdownOption } from './Dropdown';
import { ProfileInfo } from '../../state/profile';

interface ProfileCardProps {
  profile: ProfileInfo;
  editable?: boolean;
  nameAsTitle?: boolean;
}

function ProfileCard({ profile, editable, nameAsTitle }: ProfileCardProps) {
  const { user, access } = useAuth();
  const dispatch = useDispatch();
  const pfpUrlFromStore = useSelector((state: RootState) => state.profile.pfpUrl);
  const { roles } = useSelector((state: RootState) => state.roles);
  const { divisions } = useSelector((state: RootState) => state.divisions);

  const [loadedPfpUrl, setLoadedPfpUrl] = useState('');
  const [uploadedPfp, setUploadedPfp] = useState<File | null>(null);

  const [name, setName] = useState(profile.name);
  const [nameError, setNameError] = useState(false);

  const [ssn, setSsn] = useState(profile.ssn);
  const [ssnError, setSsnError] = useState(false);

  const [phone, setPhone] = useState(profile.phone);
  const [phoneError, setPhoneError] = useState(false);

  const [email, setEmail] = useState(profile.email);
  const [emailError, setEmailError] = useState(false);

  const [bleeter, setBleeter] = useState(profile.bleeter);

  const [bank, setBank] = useState(profile.bank);
  const [bankError, setBankError] = useState(false);

  const [division, setDivision] = useState(profile.division);
  const [profileRoles, setProfileRoles] = useState(profile.roles);
  const [nickname, setNickname] = useState(profile.nickname ?? "");

  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setSsn(profile.ssn);
    setNameError(false);
    setPhone(profile.phone);
    setPhoneError(false);
    setEmail(profile.email);
    setEmailError(false);
    setBleeter(profile.bleeter);
    setBank(profile.bank);
    setBankError(false);
    setUploadedPfp(null);
    setDivision(profile.division);
    setProfileRoles(profile.roles);
    setNickname(profile.nickname ?? "");

    if (user && user.uid !== profile.id && profile.pfp) {
      getProfilePictureUrl(profile.pfp).then(url => setLoadedPfpUrl(url));
    }
  }, [profile, user]);

  function validateNotEmpty(value: string, errorSetter: Dispatch<SetStateAction<boolean>>) {
    if (editable) {
      errorSetter(!value.length);
    }
  }

  function setValue(
    value: string,
    setter: Dispatch<SetStateAction<string>>,
    errorSetter?: Dispatch<SetStateAction<boolean>>,
    required = false
  ) {
    setter(value);

    if (required && errorSetter) {
      validateNotEmpty(value, errorSetter);
    }
  }

  function canSave(): boolean {
    return !nameError && !ssnError && !phoneError && !emailError && !bankError;
  }

  function isDataUpdated(): boolean {
    return name !== profile.name
      || ssn !== profile.ssn
      || phone !== profile.phone
      || email !== profile.email
      || bleeter !== profile.bleeter
      || bank !== profile.bank
      || division !== profile.division
      || !isEqual(profileRoles, profile.roles)
      || !!uploadedPfp
      || nickname !== profile.nickname;
  }

  function handleCancel() {
    setName(profile.name);
    setNameError(false);
    setSsn(profile.ssn);
    setSsnError(false);
    setPhone(profile.phone);
    setPhoneError(false);
    setEmail(profile.email);
    setEmailError(false);
    setBleeter(profile.bleeter);
    setBank(profile.bank);
    setBankError(false);
    setUploadedPfp(null);
    setDivision(profile.division);
    setProfileRoles(profile.roles);
    setNickname(profile.nickname ?? "");
  }

  async function handleSave() {
    const updatedProfile: ProfileInfo = {
      id: profile.id,
      admin: profile.admin,
      name,
      ssn,
      phone,
      email,
      bleeter,
      bank,
      division,
      roles: profileRoles,
      pfp: profile.pfp,
      discord: profile.discord,
      nickname,
    };

    setLoading(true);

    if (uploadedPfp) {
      const extention = uploadedPfp.name.split('.').pop();
      const filename = `${profile.id}.${extention}`;
      updatedProfile.pfp = filename;
      await deleteProfilePicture(profile.pfp);
      await uploadProfilePicture(uploadedPfp, filename);
      dispatch(setPfpUrl(await getProfilePictureUrl(filename)));
    }

    updateItem<ProfileInfo>(DatabaseTable.PROFILES, profile.id, updatedProfile, user);
    setLoading(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  }

  function handleSelectImage(files: FileList | null) {
    if (files && files.length) {
      const img = files[0];
      setUploadedPfp(img);
    }
  }

  function getProfilePicture() {
    if (uploadedPfp) {
      return URL.createObjectURL(uploadedPfp);
    } else if (user && user.uid === profile.id && pfpUrlFromStore) {
      return pfpUrlFromStore;
    } if (user && user.uid !== profile.id && loadedPfpUrl) {
      return loadedPfpUrl;
    } else {
      return ProfilePlaceholder;
    }
  }

  function getDivisionDropdownOptions(): DropdownOption[] {
    return divisions.map(division => ({
      key: division.id,
      text: division.name,
      value: division.id,
    }));
  }

  function getRolesDropdownOptions(): DropdownOption[] {
    return roles
      .filter(role => role.division === division || role.division === "any")
      .map(role => ({
        key: role.id,
        text: role.name,
        value: role.id,
      }));
  }

  function handleChangeDivision(value: any) {
    setProfileRoles([]);
    setDivision(value);
  }

  function handleChangeRole(value: any) {
    setProfileRoles(value);
  }

  return (
    <div className='ProfileCard'>
      <div className="ui card attached">
        <div className="content">
          <div className='ProfilePicture'>
            <div>
              <img src={getProfilePicture()} alt="Profile" />
            </div>
            {editable && <div className='UploadOverlay'>
              <i className='upload icon'></i>
            </div>}
            {editable && <input
              className='FileInput'
              type="file"
              accept='.png, .jpg, .jpeg, .gif, .webp'
              name="myImage"
              onChange={event => handleSelectImage(event.target.files)}
            />}
          </div>
          <Header text={nameAsTitle ? profile.name : 'Basic Info'} />
          <div className='ui form'>
            <div className='Row'>
              <Input
                type="text"
                name="name"
                placeholder={editable ? "Name *" : "Name"}
                icon="user"
                value={name}
                onChange={e => setValue(e, setName, setNameError, true)}
                disabled={loading}
                readonly={!editable}
                error={nameError}
              />
              <Input
                type="text"
                name="nickname"
                placeholder="Nickname"
                icon="user outline"
                value={nickname}
                onChange={e => setValue(e, setNickname)}
                disabled={loading}
                readonly={!editable}
              />
            </div>
            <div className='Row'>
              <Input
                type="text"
                name="ssn"
                placeholder={editable ? "SSN *" : "SSN"}
                icon="id card"
                value={ssn}
                onChange={e => setValue(e, setSsn, setSsnError, true)}
                disabled={loading}
                readonly={!editable}
                error={ssnError}
              />
              <Input
                type="text"
                name="phone"
                placeholder={editable ? "Phone No. *" : "Phone No."}
                icon="phone"
                value={phone}
                onChange={e => setValue(e, setPhone, setPhoneError, true)}
                disabled={loading}
                readonly={!editable}
                error={phoneError}
              />
            </div>
            <div className='Row'>
              <Input
                type="text"
                name="bank"
                placeholder={editable ? "Bank Account No. *" : "Bank Account No."}
                icon="money bill alternate"
                value={bank}
                onChange={e => setValue(e, setBank, setBankError, true)}
                disabled={loading}
                readonly={!editable}
                error={bankError}
              />
              <Dropdown
                placeholder='Division'
                disabled={loading}
                readonly={!access.headAccess}
                options={getDivisionDropdownOptions()}
                value={division}
                onChange={handleChangeDivision}
              />
            </div>
            <div className='Row'>
              <Dropdown
                placeholder='Roles'
                multiple
                disabled={loading || !division}
                readonly={!access.headAccess}
                options={getRolesDropdownOptions()}
                value={profileRoles}
                clearable
                onChange={handleChangeRole}
              />
            </div>
            {editable && <div className='Row'>
              <button
                className='ui button negative hover-animation'
                disabled={loading || !isDataUpdated()}
                onClick={handleCancel}
              >
                <p className='label contrast'>Reset</p>
                <p className='IconContainer contrast'><i className='close icon'></i></p>
              </button>
              <button
                className='ui button positive hover-animation'
                disabled={loading || !canSave() || !isDataUpdated()}
                onClick={handleSave}
              >
                <p className='label contrast'>Save</p>
                <p className='IconContainer contrast'><i className='check icon'></i></p>
              </button>
            </div>}
          </div>
        </div>
      </div>
      {showSuccessMessage && <div className="ui positive message">
        <div className="header">
          Profile successfully updated.
        </div>
      </div>}
    </div>
  );
}

export default ProfileCard;