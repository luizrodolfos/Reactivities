import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    )
    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date: string = activity.date.split('T')[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: IActivity[]}));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finish loading activities", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          this.activity = activity;
        });
      } catch (error) {
        console.log(error);
      } finally {
        runInAction("finish getting activity", () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finish creating activity", () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finish editing activity", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (id: string) => {
    this.submitting = true;
    this.target = id;
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
        if (this.activity?.id === id) {
          this.activity = null;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finish deleting activity", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };
}

export default createContext(new ActivityStore());
