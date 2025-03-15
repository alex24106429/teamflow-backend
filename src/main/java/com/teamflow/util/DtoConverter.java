package com.teamflow.util;

import com.teamflow.dto.SprintDto;
import com.teamflow.dto.TeamDto;
import com.teamflow.dto.UserDto;
import com.teamflow.model.Role;
import com.teamflow.model.Sprint;
import com.teamflow.model.Team;
import com.teamflow.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class DtoConverter {

    // User conversion
    public static UserDto convertToUserDto(User user) {
        if (user == null) return null;
        
        List<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().toString())
                .collect(Collectors.toList());
        
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.isEnabled(),
                roleNames
        );
    }
    
    // Team conversion
    public static TeamDto convertToTeamDto(Team team) {
        if (team == null) return null;
        
        List<UserDto> memberDtos = team.getMembers().stream()
                .map(DtoConverter::convertToUserDto)
                .collect(Collectors.toList());
        
        return new TeamDto(
                team.getId(),
                team.getName(),
                team.getCurrentSprintId(),
                team.getEpics(),
                memberDtos
        );
    }
    
    public static List<TeamDto> convertToTeamDtoList(List<Team> teams) {
        return teams.stream()
                .map(DtoConverter::convertToTeamDto)
                .collect(Collectors.toList());
    }
    
    // Sprint conversion
    public static SprintDto convertToSprintDto(Sprint sprint) {
        if (sprint == null) return null;
        
        TeamDto teamDto = convertToTeamDto(sprint.getTeam());
        
        return new SprintDto(
                sprint.getId(),
                sprint.getName(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                sprint.getArchivePath(),
                sprint.isActive(),
                teamDto
        );
    }
    
    public static List<SprintDto> convertToSprintDtoList(List<Sprint> sprints) {
        return sprints.stream()
                .map(DtoConverter::convertToSprintDto)
                .collect(Collectors.toList());
    }
}