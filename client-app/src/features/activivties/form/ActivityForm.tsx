import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';

import MyDateInput from '../../../app/common/form/MyDateInput';
import MySelectInput from '../../../app/common/form/MySelectInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { CategoryOptions } from '../../../app/common/options/CategoryOptions';
import LoadingComponent from '../../../app/layout/LoadingComonent';
import { ActivityFormValues } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityForm() {
  const history = useHistory();
  const { activityStore } = useStore();
  const { createActivity, updateActivity, loadActivity, loadingInitial } = activityStore;
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required(),
    date: Yup.string().required("Date is required").nullable(),
    city: Yup.string().required(),
    venue: Yup.string().required()
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity)));
  }, [id, loadActivity]);

  const handleformSubmit = (activity: ActivityFormValues) => {
    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    } else {
      updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    }
  };

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleformSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="Title" name="title" />
            <MyTextArea row={3} placeholder="Description" name="description" />
            <MySelectInput options={CategoryOptions} placeholder="Category" name="category" />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="dd MMM yyyy hh:mm"
            />
            <Header content="Loaction Details" sub color="teal" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
              floated="right"
              positive
              type="submit"
              content="Submit"
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
            />
            <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
