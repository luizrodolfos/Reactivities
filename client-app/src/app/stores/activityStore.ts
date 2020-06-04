import { observable, action } from "mobx";
import { createContext } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

class ActivityStore {
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined; 
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        activity.date = activity.date.split(".")[0];
        this.activities.push(activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingInitial = false;
    }
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      this.activities.push(activity);
      this.editMode = false;
    } catch (error) {
      console.log(error);
    } finally {
      this.submitting = false;
    }
  }

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  }

  @action setEditMode = (editMode: boolean) => {
    this.editMode = editMode;
  }

  @action setSelectedActivity = (activity: IActivity | undefined) => {
    this.selectedActivity = activity;
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      this.activities = [
        ...this.activities.filter((a) => a.id !== activity.id),
        activity,
      ];
      this.selectedActivity = activity;
      this.editMode = false;
    } catch (error) {
      console.log(error);
    } finally {
      this.submitting = false;
    }
  }

  @action deleteActivity = async (id: string) => {
    this.submitting = true;
    this.target = id;
    try {
      await agent.Activities.delete(id);
      this.activities = [...this.activities.filter((a) => a.id !== id)];
    } catch (error) {
      console.log(error);
    } finally {
      this.submitting = false;
      this.target = '';
    }
  }

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find(a => a.id === id);
    this.editMode = false;
  }
}

export default createContext(new ActivityStore());
