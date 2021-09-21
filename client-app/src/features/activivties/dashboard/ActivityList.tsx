import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Header } from 'semantic-ui-react';

import { useStore } from '../../../app/stores/store';
import ActivityListitem from './ActivityListItem';

export default observer(function ActivityList() {
  const { activityStore } = useStore();

  return (
    <>
      {activityStore.groupedActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub color="teal">
            {group}
          </Header>
          {activities.map((activity) => (
            <ActivityListitem key={activity.id} activity={activity} />
          ))}
        </Fragment>
      ))}
    </>
  );
});
