import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Divider, H2, H3, InputText, Spacing, Toggle, P } from '../../ui';
import { PrimaryColor, PrimaryColorPreview, CommunityLogoContainer, CommunityLogo, LabelAndToggle } from './style';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import UploadLogo from './UploadLogo';
import { RootState } from '../../../store';
import { setFacebookLoginEnabled, setGoogleLoginEnabled, setPrimaryColor } from '../../../store/settings';
import { AlertTypes, openAlert } from '../../../store/alert';

interface CommunitySettings {
    communityName: string;
    primaryColor: string;
    isEmailVerificationRequired: boolean;
    facebookLoginEnabled: boolean;
    googleLoginEnabled: boolean;
}

const updateCommunitySettings = async (settings: CommunitySettings) => {
    const updatedSettings = await axios.put('/settings/update-community', settings);
    return updatedSettings.data;
};

const SettingsCommunity: FC = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.settings);
    const [values, setValues] = useState({
        communityName: settings.communityName,
        primaryColor: settings.primaryColor,
        isEmailVerificationRequired: settings.isEmailVerificationRequired,
        facebookLoginEnabled: settings.facebookLoginEnabled,
        googleLoginEnabled: settings.googleLoginEnabled,
    });
    const [errors, setErrors] = useState({
        communityName: null,
        primaryColor: null,
    });

    const { mutateAsync, isLoading } = useMutation(updateCommunitySettings);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await mutateAsync({
                communityName: values.communityName,
                primaryColor: values.primaryColor,
                isEmailVerificationRequired: values.isEmailVerificationRequired,
                facebookLoginEnabled: values.facebookLoginEnabled,
                googleLoginEnabled: values.googleLoginEnabled,
            });
            dispatch(setPrimaryColor(values.primaryColor));
            if (settings.facebookLoginEnabled !== values.facebookLoginEnabled) {
                dispatch(setFacebookLoginEnabled(values.facebookLoginEnabled));
            }
            if (settings.googleLoginEnabled !== values.googleLoginEnabled) {
                dispatch(setGoogleLoginEnabled(values.googleLoginEnabled));
            }
            dispatch(
                openAlert({
                    type: AlertTypes.Success,
                    message: 'Community settings updated successfully.',
                })
            );
        } catch (error) {
            console.log('An error occurred while updating the community: ', error);
        }
    };

    const validateCommunityName = useCallback(() => {
        if (values.communityName === '') {
            setErrors((prevErrors) => ({ ...prevErrors, communityName: 'Community name is a required field.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, communityName: null }));
        }
    }, [values.communityName]);

    const validatePrimaryColor = useCallback(() => {
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!hexRegex.test(values.primaryColor)) {
            setErrors((prevErrors) => ({ ...prevErrors, primaryColor: `${values.primaryColor} is not a valid hex color.` }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, primaryColor: null }));
        }
    }, [values.primaryColor]);

    useEffect(() => {
        validateCommunityName();
        validatePrimaryColor();
    }, [validateCommunityName, validatePrimaryColor]);

    const onChange = (e: FormEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target as HTMLInputElement;
        if (name === 'isEmailVerificationRequired' || name === 'facebookLoginEnabled' || name === 'googleLoginEnabled') {
            setValues({ ...values, [name]: checked });
        } else {
            setValues({ ...values, [name]: value });
        }
    };

    return (
        <div>
            <H2>CommunitySettings</H2>
            <Divider spacing="sm" />

            <form onSubmit={onSubmit}>
                <Spacing top="md" />
                <InputText
                    name="communityName"
                    label="Community Name"
                    description="Update the community name."
                    error={errors.communityName}
                    value={values.communityName}
                    onChange={onChange}
                />

                <Spacing top="md" />
                <LabelAndToggle>
                    <div>
                        <P weight="bold">Crakd Users Access</P>
                        <Spacing top="xs">
                            <P color="textSecondary"> Is email verification required to become a user?</P>
                        </Spacing>
                    </div>
                    <Toggle name="isEmailVerificationRequired" checked={values.isEmailVerificationRequired} onChange={onChange} />
                </LabelAndToggle>

                <Spacing top="md" />
                <LabelAndToggle>
                    <div>
                        <P weight="bold">Facebook Login</P>
                        <Spacing top="xs">
                            <P color="textSecondary">Is login with Facebook enabled?</P>
                        </Spacing>
                    </div>
                    <Toggle name="facebookLoginEnabled" checked={values.facebookLoginEnabled} onChange={onChange} />
                </LabelAndToggle>

                <Spacing top="md" />
                <LabelAndToggle>
                    <div>
                        <P weight="bold">Google Login</P>
                        <Spacing top="xs">
                            <P color="textSecondary">Is login with Google enabled?</P>
                        </Spacing>
                    </div>
                    <Toggle name="googleLoginEnabled" checked={values.googleLoginEnabled} onChange={onChange} />
                </LabelAndToggle>

                <Spacing top="md" />
                <H3>Branding</H3>
                <Divider spacing="sm" />

                <PrimaryColor>
                    <InputText
                        name="primaryColor"
                        label="Brand color"
                        description="Change the brand's primary color across the platform."
                        value={values.primaryColor}
                        error={values.primaryColor}
                        onChange={onChange}
                    />
                    <PrimaryColorPreview color={values.primaryColor} />
                </PrimaryColor>

                <Spacing top="md" bottom="md">
                    <H3>Community Logo</H3>
                </Spacing>

                <CommunityLogoContainer>
                    <CommunityLogo src={settings.communityLogo} />
                    <UploadLogo imagePublicId={settings.communityLogoPublicId} />
                </CommunityLogoContainer>

                <Spacing top="md" />
                <Button color="primary" type="submit" disabled={errors.communityName || errors.primaryColor || isLoading}>
                    Save changes
                </Button>
            </form>
        </div>
    );
};

export default SettingsCommunity;