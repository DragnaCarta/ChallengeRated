import React from 'react';
import ButtonGrid from '@/components/ButtonGrid/ButtonGrid';
import ButtonToggle from '@/components/ButtonToggle/ButtonToggle';
import Card from '@/components/Card/Card'
import CardTitle from '@/components/CardTitle/CardTitle';
import ChallengeRatingOptions from '@/lib/ChallengeRatingOptions';
import CreatureToggleOptions from '@/lib/CreatureToggleOptions';

type CardBuildYourEncounterProps = {
    addCreature: (value: number) => void;
    creatureToggle: number;
    setCreatureToggle: (value: number) => void;
}

function CardBuildYourEncounter({ 
    addCreature,
    creatureToggle, 
    setCreatureToggle, 
}: CardBuildYourEncounterProps
    ) {
    
    return(
        <Card>
          <CardTitle><h2>Build Your Encounter</h2></CardTitle>
          <div style={{ margin: '1rem' }}>
            <ButtonToggle 
              label="Are you adding allies or enemies?"
              options={CreatureToggleOptions}
              selectedValue={creatureToggle}
              onClick={(value: number) => setCreatureToggle(value)}
            />
          </div>
          <div style={{ margin: '1rem' }}>
            <ButtonGrid 
              label="Add creatures that will fight in this encounter by selecting their Challenge Ratings."
              options={ChallengeRatingOptions}
              onClick={(value: number) => addCreature(value)}
              mode={creatureToggle === 0 ? 'red' : 'blue'}
            />
          </div>
        </Card>
  );
}

export default CardBuildYourEncounter;