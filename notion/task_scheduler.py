
def pre_select_tasks(tasks, target_duration=3.5):
    # Step 1: Calculate Scores
    for task in tasks:
        task['score'] = (task['interest'] + task['payoff'] + task['urgency'] + task['parties_affected']) - task[
            'effort']

    # Step 2: Separate Necessary and Moveable Tasks
    necessary_tasks = [task for task in tasks if task['priority'] == 'necessary' or task['due_date'] <= today]
    moveable_tasks = [task for task in tasks if task['priority'] == 'moveable']

    # Step 3: Schedule Necessary Tasks First
    selected_tasks = []
    total_duration = 0

    for task in necessary_tasks:
        if total_duration + task['duration'] <= target_duration:
            selected_tasks.append(task)
            total_duration += task['duration']

    # Step 4: Schedule Moveable Tasks
    sorted_moveable_tasks = sorted(moveable_tasks, key=lambda x: x['score'], reverse=True)

    for task in sorted_moveable_tasks:
        if total_duration + task['duration'] <= target_duration:
            selected_tasks.append(task)
            total_duration += task['duration']
        if total_duration >= target_duration:
            break

    return selected_tasks


# Example Task List
tasks = [
    {'name': 'Task A', 'duration': 0.5, 'interest': 3, 'payoff': 2, 'urgency': 1, 'effort': 2, 'parties_affected': 2,
     'priority': 'moveable', 'due_date': '2024-08-25'},
    {'name': 'Task B', 'duration': 1.5, 'interest': 1, 'payoff': 3, 'urgency': 3, 'effort': 3, 'parties_affected': 1,
     'priority': 'necessary', 'due_date': '2024-08-22'},
    {'name': 'Task C', 'duration': 3.5, 'interest': 2, 'payoff': 2, 'urgency': 2, 'effort': 1, 'parties_affected': 2,
     'priority': 'moveable', 'due_date': '2024-08-30'}
]

# Assuming today is 2024-08-22
selected_tasks = pre_select_tasks(tasks)
