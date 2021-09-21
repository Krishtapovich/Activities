import { observer } from 'mobx-react-lite';
import React from 'react';
import * as UI from 'semantic-ui-react';

import { Profile } from '../../app/models/profile';
import FollowButton from './FollowButton';

interface Props {
  profile: Profile;
}

export default observer(function ProfileHeader({ profile }: Props) {
  return (
    <UI.Segment>
      <UI.Grid>
        <UI.Grid.Column width={12}>
          <UI.Item.Group>
            <UI.Item>
              <UI.Item.Image avatar size="small" src={profile.image || "/assets/user.png"} />
              <UI.Item.Content verticalAlign="middle">
                <UI.Header as="h1" content={profile.displayName} />
              </UI.Item.Content>
            </UI.Item>
          </UI.Item.Group>
        </UI.Grid.Column>
        <UI.GridColumn width={4}>
          <UI.Statistic.Group width={2}>
            <UI.Statistic label="Followers" value={profile.followersCount} />
            <UI.Statistic label="Following" value={profile.followingCount} />
          </UI.Statistic.Group>
          <UI.Divider />
          <FollowButton profile={profile} />
        </UI.GridColumn>
      </UI.Grid>
    </UI.Segment>
  );
});
