import React, { useState } from 'react';
import MealPlanList from '../../components/plans/mealPlanList';

export default function PlanShow({ plans }) {
  const [didShare, setDidShare] = useState(false);
  // Format text and copy it to clipboard
  const share = () => {
    let textToShare = ``;
    plans.forEach((plan) => {
      textToShare =
        textToShare + `${plan.meal.title} \n ${plan.meal.whereToFind} \n`;
      if (plan.ingredients.length > 0) {
        plan.ingredients.forEach((listItem) => {
          const isComplete = listItem.isCompleted ? '☒' : '☐';
          textToShare = textToShare + `${isComplete} ${listItem.title} \n`;
        });
        textToShare = textToShare + '\n';
      } else {
        textToShare = textToShare + '\n';
      }
    });

    navigator.clipboard.writeText(textToShare);
    setDidShare(true);
  };

  return (
    <div>
      <div className="d-flex w-100 justify-content-between">
        <h1>Weekly plan</h1>
        <button type="button" className="btn btn-link">
          <h5 onClick={share}>{didShare ? 'Copied to clipboard' : 'Share'}</h5>
        </button>
      </div>
      <MealPlanList planList={plans} />
    </div>
  );
}

PlanShow.getInitialProps = async (context, client) => {
  const { data: plans } = await client.get('/api/plans');

  console.log(plans);
  return { plans };
};
