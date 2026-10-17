import axios from 'axios';
import { useContext, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Dropdown, Input, Label, Modal, useOverlayState } from '@heroui/react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthContext';
import Spinner from '../Spinner/Spinner';
import PosrCard from '../PosrCard/PosrCard';
import CreatePostCard from '../../CreatePostCard/CreatePostCard';

export default function Profile() {
  const queryClient = useQueryClient();
  const { userData, getUserData, setUserToken } = useContext(AuthContext);
  const photoInputRef = useRef(null);
  const passwordModal = useOverlayState();
  const photoModal = useOverlayState();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  function getProfilePosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${userData._id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }

  const uploadPhotoMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('photo', file);
      return axios.put(`https://route-posts.routemisr.com/users/upload-photo`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    onSuccess: async () => {
      toast.success('Profile image updated');
      await getUserData();
      queryClient.invalidateQueries({ queryKey: ['getProfilePost'] });
      resetPhotoForm();
      photoModal.close();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to upload photo');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      axios.patch(
        `https://route-posts.routemisr.com/users/change-password`,
        { password, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      ),
    onSuccess: (response) => {
      const nextToken = response?.data?.data?.token;
      if (nextToken) {
        localStorage.setItem('token', nextToken);
        setUserToken(nextToken);
      }
      toast.success('Password changed successfully');
      setPassword('');
      setNewPassword('');
      passwordModal.close();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    },
  });

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['getProfilePost', 'nProfilePictureChange'],
    queryFn: getProfilePosts,
    enabled: !!userData?._id,
    select: (res) => res?.data?.data?.posts,
  });

  function resetPhotoForm() {
    setPhotoPreview(null);
    setSelectedPhoto(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  }

  function handlePhotoPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function openPhotoModal() {
    resetPhotoForm();
    photoModal.open();
  }

  function openPasswordModal() {
    setPassword('');
    setNewPassword('');
    passwordModal.open();
  }

  if (isLoading || !userData) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <h2 className="text-heading">{error.message}</h2>
      </div>
    );
  }

  return (
    <>
      <div className="page-shell">
        <div className="relative w-full  mx-auto mt-6 mb-4 overflow-hidden rounded-2xl border border-default bg-neutral-primary shadow-sm">
          <div className="profile-cover h-40" />

          <div className="relative px-6 pb-6 -mt-16">
            <div className="flex justify-end pt-2">
              <Dropdown>
                <Button aria-label="Profile settings" variant="secondary" className="gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.174.1.31.245.41.41.112.185.174.4.174.623v.016c0 .223-.062.438-.174.623a1.6 1.6 0 0 1-.41.41c-.332.184-.582.496-.645.87l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a1.6 1.6 0 0 1-.41-.41 1.23 1.23 0 0 1-.174-.623v-.016c0-.223.062-.438.174-.623.1-.165.236-.31.41-.41.332-.184.582-.496.645-.87l.213-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Settings
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    onAction={(key) => {
                      if (key === 'change-password') openPasswordModal();
                      if (key === 'change-photo') openPhotoModal();
                    }}
                  >
                    <Dropdown.Item id="change-password" textValue="Change password">
                      <Label>Change Password</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="change-photo" textValue="Change profile image">
                      <Label>Change Profile Image</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>

            <div className="relative w-32 h-32 mx-auto -mt-6">
              <img
                className="w-32 h-32 rounded-full border-4 border-primary-foreground object-cover shadow-md"
                src={userData?.photo}
                alt={userData?.name}
              />
            </div>

            <div className="text-center mt-4">
              <h2 className="text-2xl font-semibold text-primary-foreground tracking-tight">{userData?.name}</h2>
              <p className="text-sm text-secondary-foreground mt-1">@{userData?.username || userData?.email}</p>
              <p className="text-sm text-secondary-foreground mt-2">Born {userData?.dateOfBirth}</p>
            </div>

            <div className="flex justify-center gap-10 mt-6 border-t border-default pt-6">
              <div className="text-center">
                <p className="font-bold text-lg text-primary-foreground">{userData?.followers?.length ?? 0}</p>
                <p className="text-sm text-secondary-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-primary-foreground">{userData?.followingCount ?? 0}</p>
                <p className="text-sm text-secondary-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-primary-foreground">{data?.length ?? 0}</p>
                <p className="text-sm text-secondary-foreground">Posts</p>
              </div>
            </div>
          </div>
        </div>
            <CreatePostCard/>
        <div className="mt-6 space-y-0">
          {data?.map((post) => (
            <PosrCard key={post._id || post.id} post={post} />
          ))}
        </div>
      </div>

      <Modal state={passwordModal}>
        <span className="hidden" aria-hidden="true" />
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Change Password</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="flex flex-col gap-3">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Current password"
                    placeholder="Current password"
                  />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    aria-label="New password"
                    placeholder="New password"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="w-full"
                  isDisabled={changePasswordMutation.isPending || !password || !newPassword}
                  onClick={() => changePasswordMutation.mutate()}
                >
                  {changePasswordMutation.isPending ? 'Saving...' : 'Update Password'}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal state={photoModal}>
        <span className="hidden" aria-hidden="true" />
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Change Profile Image</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={photoPreview || userData?.photo}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-2 border-accent"
                  />
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handlePhotoPick}
                  />
                  <Button variant="secondary" onClick={() => photoInputRef.current?.click()}>
                    Choose Image
                  </Button>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="w-full"
                  isDisabled={uploadPhotoMutation.isPending || !selectedPhoto}
                  onClick={() => uploadPhotoMutation.mutate(selectedPhoto)}
                >
                  {uploadPhotoMutation.isPending ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
